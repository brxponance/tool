#!/bin/sh
# One-command deploy from AWS CloudShell (interim, until GitHub Actions OIDC is
# unblocked by an admin). Usage:
#
#   cd ~/tool && git pull && bash deploy.sh
#
# Builds both images, pushes to ECR, forces the ECS service to redeploy, and
# prints the app URL when done. Prunes Docker first so CloudShell's small disk
# doesn't fill up.
set -e

ACCT=872709212513
REGION=us-east-1
ECR="$ACCT.dkr.ecr.$REGION.amazonaws.com"
CLUSTER=pc-tool-cluster
SERVICE=pc-tool

echo "==> Freeing Docker disk space..."
docker system prune -af >/dev/null 2>&1 || true

echo "==> Logging in to ECR..."
aws ecr get-login-password --region "$REGION" \
  | docker login --username AWS --password-stdin "$ECR"

echo "==> Building + pushing backend..."
docker build -t "$ECR/pc-tool-backend:latest" ./backend
docker push "$ECR/pc-tool-backend:latest"

echo "==> Building + pushing frontend..."
docker build -t "$ECR/pc-tool-frontend:latest" ./frontend
docker push "$ECR/pc-tool-frontend:latest"

echo "==> Forcing ECS redeploy..."
aws ecs update-service --cluster "$CLUSTER" --service "$SERVICE" \
  --force-new-deployment --region "$REGION" \
  --query 'service.serviceName' --output text

echo "==> Waiting for the service to stabilize (this can take a few minutes)..."
aws ecs wait services-stable --cluster "$CLUSTER" --services "$SERVICE" --region "$REGION"

echo "==> Deployed. Current app URL:"
TASK=$(aws ecs list-tasks --cluster "$CLUSTER" --service-name "$SERVICE" --region "$REGION" --desired-status RUNNING --query 'taskArns[0]' --output text)
ENI=$(aws ecs describe-tasks --cluster "$CLUSTER" --tasks "$TASK" --region "$REGION" --query 'tasks[0].attachments[?type==`ElasticNetworkInterface`].details[]' --output json | python3 -c "import sys,json;d=json.load(sys.stdin);print([x['value'] for x in d if x['name']=='networkInterfaceId'][0])")
IP=$(aws ec2 describe-network-interfaces --network-interface-ids "$ENI" --region "$REGION" --query 'NetworkInterfaces[0].Association.PublicIp' --output text)
echo "    http://$IP:3000"
