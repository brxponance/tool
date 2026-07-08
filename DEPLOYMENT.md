# Deployment Runbook

The tool is two containers plus two managed AWS services:

- **Backend** — Python / Flask + gunicorn, serves JSON on **:3001**
- **Frontend** — Next.js (standalone), serves the UI on **:3000**, proxies
  `/api/backend/*` to the backend
- **RDS Postgres** — the source of truth for clients, weights, and saved drafts
- **S3** — stores uploaded workbooks (survives instance replacement)

Recommended shape for this scale (~3 clients, small internal team):
**one EC2 box running both containers, behind an ALB, with RDS + S3.**
~$35–45/month.

```
Users ─→ ALB :443  (HTTPS + Cognito login)
            ↓
       EC2 t3.small   (docker compose -f docker-compose.prod.yml up)
         ├ frontend :3000  (Next.js)
         └ backend  :3001  (Flask/gunicorn)
                ↓                 ↓
          RDS Postgres        S3 bucket
       (clients/weights)   (uploaded workbooks)
```

---

## Local development

```powershell
cd backend
docker compose up -d          # local Postgres
py run.py                     # backend → :3001

cd ../frontend
npm run dev                   # frontend → :3000 (or next free port)
```

---

## What's containerized

- `backend/Dockerfile` — installs deps, copies code + `db/` + `migrations/`,
  runs `entrypoint.sh` (waits for DB → `alembic upgrade head` → idempotent seed
  → gunicorn).
- `frontend/Dockerfile` — multi-stage; builds the Next.js standalone bundle and
  runs `node server.js`.
- `docker-compose.prod.yml` — runs both containers on the EC2 host. Reads
  secrets from a local `.env` (see `.env.prod.example`).

Both images build and run clean (verified: backend migrates+seeds against
Postgres and serves the API; frontend proxies `/api/backend/*` to it).

---

## AWS deployment — step by step

You do these in the AWS console (they need your account). Pick **one region**
and use it for everything (RDS, S3, EC2 all in the same region).

### 1. S3 bucket (uploads)

1. S3 → Create bucket → name e.g. `pc-tool-uploads-<yourorg>` → your region →
   Block all public access **ON** → Create.

### 2. RDS Postgres

1. RDS → Create database → **PostgreSQL** → **Free tier** or **Dev/Test**.
2. Instance: **db.t3.micro**. Storage: 20 GB gp3.
3. DB name `pc_tool`, master username `pc_tool`, set a strong password.
4. Connectivity: same VPC as the EC2 you'll create; **Public access: No**.
5. After it's up, note the **endpoint** — this becomes `DATABASE_URL`.

### 3. EC2 instance

1. EC2 → Launch instance → **Ubuntu 22.04**, **t3.small**.
2. Same VPC/region as RDS.
3. **IAM role**: create/attach a role with `AmazonS3FullAccess` (or a policy
   scoped to just your bucket) so the backend can read/write S3 without keys.
4. Security group:
   - Inbound `443` and `80` from the ALB security group only.
   - Inbound `22` (SSH) from your IP only.
5. Make sure the **RDS security group allows inbound 5432 from the EC2's
   security group**.

### 4. Install and run on the EC2

SSH in, then:

```bash
sudo apt update && sudo apt install -y docker.io docker-compose-plugin git
sudo usermod -aG docker ubuntu && newgrp docker

git clone <your-repo-url> /opt/pc_tool
cd /opt/pc_tool

# Create the secrets file
cp .env.prod.example .env
nano .env      # fill in DATABASE_URL (RDS endpoint), S3_BUCKET, AWS_REGION

# Build and start both containers
docker compose -f docker-compose.prod.yml up -d --build
```

On first boot the backend entrypoint automatically runs migrations and seeds
the 12 clients from the workbook. Check it:

```bash
docker compose -f docker-compose.prod.yml logs backend | tail -20
curl http://localhost:3000/api/backend/clients   # expect {"clients":[...],"editable":true}
```

### 5. ALB + HTTPS + login

1. EC2 → Target Groups → create one targeting the EC2 on **port 3000**.
2. EC2 → Load Balancers → **Application Load Balancer**, internet-facing,
   listener on **443** (attach an ACM cert — request a free one in ACM;
   for the default AWS URL you can start with an HTTP:80 listener and add
   HTTPS once you attach a domain).
3. Forward the listener to the target group.
4. **Login (Cognito):** on the 443 listener rule, add an **Authenticate
   (Cognito)** action before Forward. Create a Cognito user pool, add your
   users. This is how "everyone" logs in securely from anywhere.
5. Open the ALB's DNS name in a browser → you get the Cognito login → the app.

---

## Environment variables (backend container)

| Var | Required | Purpose |
|---|---|---|
| `DATABASE_URL` | **yes** (prod) | RDS connection string |
| `APP_ENV` | recommended | set to `production` so a missing `DATABASE_URL` fails fast |
| `S3_BUCKET` | for uploads | enables S3 storage of uploaded workbooks |
| `S3_PREFIX` | no | key prefix, default `uploads/` |
| `AWS_REGION` | no | defaults to `us-east-1` |

Frontend container: `BACKEND_INTERNAL_URL=http://backend:3001` (set by compose).

---

## Updating the deployed app

```bash
cd /opt/pc_tool
git pull
docker compose -f docker-compose.prod.yml up -d --build
```

Migrations run automatically on backend start. Zero manual DB steps.

---

## Backups & data safety

- **Clients / weights / drafts** live in RDS → enable **automated RDS
  backups** (7-day retention is the default; keep it).
- **Uploaded workbooks** live in S3 → enable **versioning** on the bucket.
- **Clone cache** (`cache/results.pkl`) is *derived* data on the container's
  disk. If the instance is replaced it rebuilds on the next `/run` (~30s). Not
  backed up on purpose — nothing irreplaceable lives there.

---

## Smoke tests after deploy

```bash
curl https://<alb-dns>/api/backend/status     # {"has_results":...}
curl https://<alb-dns>/api/backend/clients    # {"clients":[...],"editable":true}
curl -I https://<alb-dns>/portfolio           # HTTP 200
```

Then open the app, add a test client, save a weight, refresh — it should
persist (that's RDS working).

---

## Known limitations (fine for this scale)

- **Single instance** — a reboot causes a ~1-minute blip. True HA needs 2+
  instances (triples cost; not needed here).
- **Single gunicorn worker** — required because the backend holds analytical
  state in memory. Do not raise `--workers`.
- **Cache is instance-local** — see Backups above; it self-heals.
