---
name: deploy
description: Commit and push to GitHub and deploy the PC Tool to production (AWS ECS), then verify it came up healthy. Use when the user asks to deploy, ship, release, push, push to GitHub, push to production, or says the live site needs updating. Also use to check whether the last deploy succeeded or to diagnose a failed/red deploy.
---

# Push to GitHub and deploy the PC Tool

Gets local work onto `main` and into production, then confirms it is actually
serving. Written so someone with no AWS knowledge can run it and get a
trustworthy answer.

Pushing to `main` **is** deploying — there is no separate release step. Treat a
push as a production action.

**Live URL:** http://pc-tool-alb-149658130.us-east-1.elb.amazonaws.com

## Fixed facts

```
region    us-east-1          cluster  pc-tool-cluster        service  pc-tool
account   872709212513       ALB      pc-tool-alb-149658130.us-east-1.elb.amazonaws.com
log group /ecs/pc-tool       DB       xponance-db (RDS Postgres 16)
DSN secret pc-tool/database-url        repo  brxponance/tool
```

Deploys run through GitHub Actions (`.github/workflows/deploy.yml`): build both
images → push to ECR → force an ECS redeploy → wait for stability. ~6–8 minutes.

## Step 1 — Commit and push

A deploy ships what is on `origin/main`, not what is on disk.

```bash
git status --short                     # what's uncommitted
git log --oneline origin/main..HEAD    # local commits not yet pushed
```

**Before committing anything, verify it builds.** Pushing a broken build wastes a
full deploy cycle:

```bash
cd frontend && npx tsc --noEmit && npx next build
cd backend && ./venv/Scripts/python.exe -c "import app; print('backend imports OK')"
```

Then commit only what belongs to this change — read the diff first, and leave
unrelated work-in-progress files (e.g. someone's half-edited notes) alone:

```bash
git add <the files for this change>
git commit -m "..."      # end the message with the Co-Authored-By trailer
git push origin main
```

Rules for this step:

- **Confirm with the user before pushing** unless they've clearly just asked you
  to push/deploy. A push is a live production deploy.
- **Never blanket `git add -A`** without reading `git status` — this repo often has
  unrelated dirty files.
- If the tree is dirty with things unrelated to the change, list them and ask.
- If everything is already pushed and they just want production refreshed, skip to
  Step 2 and force a redeploy.

> A push only triggers the workflow when files under `backend/**`, `frontend/**`,
> or `.github/workflows/deploy.yml` change. Docs-only pushes (README, DEPLOYMENT,
> `.claude/`) deliberately do **not** deploy — say so, rather than letting the user
> wait for a run that will never appear.

## Step 2 — Trigger the deploy

Pushing to `main` deploys automatically. If everything is already pushed and the
user wants to redeploy the same code, force it:

```bash
aws ecs update-service --cluster pc-tool-cluster --service pc-tool \
  --force-new-deployment --region us-east-1 --query 'service.serviceName' --output text
```

Tell the user they can also do it themselves with no terminal:
**GitHub → Actions → "Build and Deploy to ECS" → "Run workflow"**.

## Step 3 — Wait for it, properly

```bash
aws ecs wait services-stable --cluster pc-tool-cluster --services pc-tool --region us-east-1
```

This is the same waiter CI uses. It polls for up to 10 minutes. Success is
silent; on timeout it only ever prints `Max attempts exceeded`, which means
"tasks aren't staying healthy" and nothing more — go to **Diagnosing** below.

## Step 4 — Verify it is genuinely live

Do not report success off the waiter alone. Check all three:

```bash
# a) rollout finished with no failed tasks
aws ecs describe-services --cluster pc-tool-cluster --services pc-tool --region us-east-1 \
  --query 'services[0].{running:runningCount,desired:desiredCount,rollout:deployments[0].rolloutState,failed:deployments[0].failedTasks}' --output json

# b) the running image is the one just built
aws ecs describe-tasks --cluster pc-tool-cluster --region us-east-1 \
  --tasks $(aws ecs list-tasks --cluster pc-tool-cluster --service-name pc-tool \
            --region us-east-1 --query 'taskArns[0]' --output text) \
  --query 'tasks[0].containers[?name==`backend`].imageDigest' --output text
aws ecr describe-images --repository-name pc-tool-backend --region us-east-1 \
  --image-ids imageTag=latest --query 'imageDetails[0].imageDigest' --output text

# c) the app answers through the load balancer
ALB=pc-tool-alb-149658130.us-east-1.elb.amazonaws.com
curl -s -o /dev/null -w '%{http_code}\n' http://$ALB/api/backend/status
curl -s -o /dev/null -w '%{http_code}\n' http://$ALB/api/backend/clients
```

Green means: `rollout=COMPLETED`, `failed=0`, `running=desired`, the two digests
**match**, and both endpoints return `200`.

`/clients` returning 200 is the meaningful one — the container only reaches
gunicorn after `alembic upgrade head` succeeds, so it proves the database
connection works rather than silently falling back.

## Diagnosing a failed deploy

The workflow diagnoses itself: open the failed run and expand
**"Explain the failure"** — it prints deployment state, ECS events, stopped-task
exit codes and the last 80 log lines. Read that first.

To do the same locally:

```bash
# why did the tasks stop?
aws ecs describe-tasks --cluster pc-tool-cluster --region us-east-1 \
  --tasks $(aws ecs list-tasks --cluster pc-tool-cluster --service-name pc-tool \
            --desired-status STOPPED --region us-east-1 --query 'taskArns[:3]' --output text) \
  --query 'tasks[].{stopped:stoppedReason,code:stopCode,containers:containers[].{name:name,exit:exitCode}}' --output json

# logs (note: on Git Bash, prefix MSYS_NO_PATHCONV=1 or the leading / gets mangled
# into a Windows path, and PYTHONUTF8=1 avoids a charmap crash on the ▲ character)
MSYS_NO_PATHCONV=1 PYTHONUTF8=1 aws logs tail /ecs/pc-tool --region us-east-1 --since 15m
```

### Known failure modes, most likely first

**1. `password authentication failed for user "postgres"` → backend exits 1**

The DSN in `pc-tool/database-url` no longer matches the RDS password. The
entrypoint retries 30× (~6.5 min) then exits, so the service never stabilizes
and the waiter times out.

Note the shape of this one: a *running* container never re-reads the password, so
the app can look fine for hours after the credential breaks. It only surfaces when
something forces a new task — usually a deploy. The deploy is the messenger, not
the cause.

Fix: DEPLOYMENT.md §5 "Database password". Password rotation is deliberately OFF;
if `MasterUserSecret` on the instance is non-null, someone re-enabled it and it
will keep breaking. When rebuilding the DSN, **URL-encode the password** —
characters like `[` make URL parsers read it as an IPv6 host.

**2. `Task failed ELB health checks`**

Container too slow to boot or pegging the 0.5 vCPU. Anything heavy and
CPU-bound at import time starves the gunicorn threads answering `/status`,
because the parse holds the GIL. See DEPLOYMENT.md §14. Never add blocking work
to module scope in `backend/app.py`.

**3. Image pull / ECR auth errors** — usually transient; re-run.

## After a deploy — nothing

There is no manual follow-up step. The app re-reads its input files by itself
when a deploy changes how they're parsed (`INPUT_PARSER_VERSION`, DEPLOYMENT.md
§16). Do not tell the user to click "Reload Inputs".

## Rules

- Report what the checks returned, not "it should be fine". If a check failed,
  say which one and what it said.
- Deploying ships **code, not data**. Uploaded workbooks and computed results live
  in S3 and the cache; a deploy never touches them, and never re-runs the 5–15
  minute universe clone.
- Never print a database password or secret value into the transcript.
- `deploy.sh` is a legacy CloudShell fallback from before Actions OIDC worked.
  Prefer the workflow; only reach for `deploy.sh` if Actions is unavailable.
