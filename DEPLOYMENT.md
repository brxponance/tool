# Deployment Guide — PC Tool (Aapryl Clone Tool)

> Everything a teammate or agent needs to understand, run, and deploy this app.
> Written against the **actual live deployment** (AWS ECS Fargate + RDS + S3),
> not a hypothetical plan.

---

## 1. What this app is

A portfolio-analysis tool with two parts:

- **Backend** — Python / Flask + gunicorn. JSON API on **port 3001**. Does the
  cloning/risk/exposure math; owns the Postgres client database.
- **Frontend** — Next.js (React). UI on **port 3000**. Calls the backend through
  a same-origin proxy at `/api/backend/*`.

Data stores:
- **RDS PostgreSQL** — the editable client roster (names, benchmarks, managers,
  weights, saved drafts). Database name `pc_tool`.
- **S3** — uploaded Excel workbooks + the analytical cache (`results.pkl`).

---

## 2. Live deployment at a glance

| Thing | Value |
|---|---|
| AWS account | `872709212513` (alias `xponance-sandbox`) |
| Region | `us-east-1` |
| Compute | ECS Fargate, cluster `pc-tool-cluster`, service `pc-tool` |
| Task def | `pc-tool` — ONE task, TWO containers (backend + frontend) |
| Container wiring | frontend → backend over `http://localhost:3001` (same task) |
| Database | RDS `xponance-db` (PostgreSQL), database `pc_tool` |
| File storage | S3 bucket `pc-tool-uploads` |
| Images | ECR: `pc-tool-backend:latest`, `pc-tool-frontend:latest` |
| Public access | frontend task public IP on port 3000 (no ALB yet) |
| CI/CD | GitHub Actions (`.github/workflows/deploy.yml`) |

> **Why one task with two containers?** ECS Service Connect (separate services)
> failed to register instances in this account, so both containers run in a
> single task and talk over `localhost` — reliable, no service discovery.

---

## 3. Architecture diagram

```
Users ─→ http://<frontend-task-public-ip>:3000
             │
        ECS Fargate task "pc-tool" (1 task, 2 containers)
          ├ frontend :3000  (Next.js)  ──localhost:3001──┐
          └ backend  :3001  (Flask/gunicorn) ◄───────────┘
                 │                    │
          RDS xponance-db        S3 pc-tool-uploads
          (database pc_tool)     (uploads/ + state/results.pkl)
```

---

## 4. How deploys work now (the normal path)

**Just push to `main`.** GitHub Actions does the rest:

```bash
git add -A && git commit -m "your change" && git push origin main
```

The workflow (`.github/workflows/deploy.yml`) then automatically:
1. Builds the backend and frontend Docker images
2. Pushes them to ECR
3. Forces the ECS service to redeploy with the new images
4. Waits until the service is stable

Watch it run at: **https://github.com/brxponance/tool/actions**

No CloudShell, no manual Docker builds. A deploy takes ~5–8 minutes.

> Triggers only when files under `backend/`, `frontend/`, or the workflow
> itself change. You can also run it manually: Actions tab → "Build and Deploy
> to ECS" → "Run workflow".

---

## 5. Credentials & secrets — where everything lives

**No secrets are stored in this repo.** They live in AWS/GitHub:

| Secret | Where it lives | Purpose |
|---|---|---|
| RDS master password | AWS Secrets Manager: `rds!db-220cca1f-...` | DB master (`postgres`) password |
| Full `DATABASE_URL` | AWS Secrets Manager: `pc-tool/database-url` | Injected into the backend container at runtime |
| GitHub → AWS deploy auth | GitHub OIDC + IAM role `pc-tool-gh-deploy` | Lets Actions push to ECR + redeploy ECS (no long-lived keys) |
| `AWS_DEPLOY_ROLE_ARN` | GitHub repo secret | `arn:aws:iam::872709212513:role/pc-tool-gh-deploy` |

Retrieve the DB password if ever needed:
```bash
aws secretsmanager get-secret-value \
  --secret-id 'arn:aws:secretsmanager:us-east-1:872709212513:secret:rds!db-220cca1f-3c4a-483d-a491-9db3aeca5ad0-SuoyWk' \
  --region us-east-1 --query SecretString --output text
```

`DATABASE_URL` format (password is URL-encoded):
`postgresql://postgres:<url-encoded-pw>@xponance-db.c6jsaqkqwyk4.us-east-1.rds.amazonaws.com:5432/pc_tool`

---

## 6. Key AWS resource IDs

```
VPC:                vpc-0a80f9aa9ec30d318 (gire-vpc)
Public subnets:     subnet-0117510ecaa995dd2 (us-east-1a)
                    subnet-0648b89505cb4cf4b (us-east-1b)
Task security group: sg-04375bcde7b5211c5 (pc-tool-tasks)
RDS security group:  sg-0a6469eda7b097066 (allows 5432 from task SG)
RDS endpoint:        xponance-db.c6jsaqkqwyk4.us-east-1.rds.amazonaws.com:5432
S3 bucket:           pc-tool-uploads
ECR backend:         872709212513.dkr.ecr.us-east-1.amazonaws.com/pc-tool-backend
ECR frontend:        872709212513.dkr.ecr.us-east-1.amazonaws.com/pc-tool-frontend
IAM task exec role:  pc-tool-exec   (ECR pull, read DB secret, logs)
IAM task role:       pc-tool-task   (S3 access)
IAM deploy role:     pc-tool-gh-deploy (GitHub Actions OIDC)
CloudWatch logs:     /ecs/pc-tool
```

---

## 7. How data loads (important — read this)

On every container start, the backend `entrypoint.sh`:
1. Waits for RDS, creates the `pc_tool` database if missing
2. Runs Alembic migrations to head
3. Seeds the client roster: downloads the weights workbook from S3 and imports
   the clients into RDS (idempotent — skips if clients already exist)
4. Starts gunicorn; `app.py` then restores the analytical cache from
   `s3://pc-tool-uploads/state/results.pkl`

**Result: the app boots fully populated with no manual upload.** Users just open
the URL. Uploading new files via the Setup tab saves them to S3 and persists.

To refresh the source data: upload new files via the app's **Setup** tab, or
replace the objects in S3 (`uploads/` prefix) and re-run clones in the app.

---

## 8. Finding the current URL (it changes on redeploy)

The frontend task gets a new public IP each redeploy (no ALB yet). Get the
current one:

```bash
TASK=$(aws ecs list-tasks --cluster pc-tool-cluster --service-name pc-tool --region us-east-1 --desired-status RUNNING --query 'taskArns[0]' --output text)
ENI=$(aws ecs describe-tasks --cluster pc-tool-cluster --tasks "$TASK" --region us-east-1 --query 'tasks[0].attachments[?type==`ElasticNetworkInterface`].details[]' --output json | python3 -c "import sys,json;d=json.load(sys.stdin);print([x['value'] for x in d if x['name']=='networkInterfaceId'][0])")
aws ec2 describe-network-interfaces --network-interface-ids "$ENI" --region us-east-1 --query 'NetworkInterfaces[0].Association.PublicIp' --output text
```

> **TODO for a stable URL:** add an Application Load Balancer (~$16/mo). Gives a
> permanent hostname + HTTPS and removes the changing-IP problem. Not done yet.

---

## 9. Viewing logs & debugging

```bash
# live tail of both containers
aws logs tail /ecs/pc-tool --region us-east-1 --follow

# last 10 minutes
aws logs tail /ecs/pc-tool --region us-east-1 --since 10m

# is the service healthy?
aws ecs describe-services --cluster pc-tool-cluster --services pc-tool \
  --region us-east-1 --query 'services[0].{running:runningCount,pending:pendingCount}' --output table
```

Also viewable in the console: **CloudWatch → Log groups → `/ecs/pc-tool`**.

---

## 10. Local development

```bash
# backend (needs local Postgres — docker compose in backend/)
cd backend
docker compose up -d        # local Postgres on :5432
py run.py                   # backend on :3001

# frontend (separate terminal)
cd frontend
npm run dev                 # UI on :3000, proxies to backend
```

First-time DB setup locally: `py -m alembic upgrade head && py -m db.seed`.

---

## 11. Manual deploy (fallback if GitHub Actions is unavailable)

Only needed if CI is broken. In AWS CloudShell:

```bash
git clone https://github.com/brxponance/tool.git && cd tool
ACCT=872709212513; REGION=us-east-1; ECR=$ACCT.dkr.ecr.$REGION.amazonaws.com
aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin $ECR
docker system prune -af      # CloudShell has ~16GB; prune to avoid "no space"
docker build -t $ECR/pc-tool-backend:latest ./backend && docker push $ECR/pc-tool-backend:latest
docker build -t $ECR/pc-tool-frontend:latest ./frontend && docker push $ECR/pc-tool-frontend:latest
aws ecs update-service --cluster pc-tool-cluster --service pc-tool --force-new-deployment --region us-east-1
```

---

## 12. First-time infrastructure setup (already done — for reference/rebuild)

If this ever needs to be rebuilt from scratch in a new account, the order was:
1. S3 bucket `pc-tool-uploads`
2. Reuse RDS `xponance-db`; app auto-creates the `pc_tool` database on boot
3. Store `DATABASE_URL` in Secrets Manager (`pc-tool/database-url`), password URL-encoded
4. IAM roles: `pc-tool-exec` (+ AmazonECSTaskExecutionRolePolicy, SecretsManagerReadWrite),
   `pc-tool-task` (+ AmazonS3FullAccess)
5. Security groups: `pc-tool-tasks`; open RDS SG 5432 from it
6. ECR repos; build + push both images
7. ECS task def `pc-tool` (2 containers) + service `pc-tool` (assignPublicIp ENABLED)
8. Seed data: upload workbooks + `results.pkl` to S3
9. GitHub Actions: OIDC provider + role `pc-tool-gh-deploy`, secret `AWS_DEPLOY_ROLE_ARN`

Full command history for these steps is in the git log and this repo's earlier
setup notes.

---

## 13. Known limitations / TODO

- **No stable URL / HTTPS** — add an ALB (changing IP + "Not secure" today).
- **No app-level auth** — anyone with the URL can use it. Add nginx basic-auth,
  Cognito at an ALB, or an IP allowlist before broad use.
- **Single task** — a redeploy causes a ~1-minute blip. Fine for internal use.
- **Sandbox account** — EC2 (`ec2:RunInstances`) and IAM inline policies
  (`iam:PutRolePolicy`) are DENIED here; that's why the app uses Fargate and
  attach-managed-policy (not inline). Keep this in mind if extending.
- **Clone cache is derived data** — safe to lose; rebuilds from uploaded files.
