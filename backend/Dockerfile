FROM python:3.11-slim

WORKDIR /app

# Install dependencies first (cached layer). requirements.txt already includes
# gunicorn, boto3, SQLAlchemy, psycopg2-binary, and alembic.
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code: engines, the db package, and Alembic migrations.
COPY *.py .
COPY db/ ./db/
COPY migrations/ ./migrations/
COPY alembic.ini .
COPY entrypoint.sh .
RUN chmod +x entrypoint.sh

# Baked cache snapshot (clone results + normalized skill). Clients/weights now
# live in Postgres, but the heavy analytical cache still loads from disk. In
# production this is overlaid by S3 when S3_BUCKET is set.
RUN mkdir -p uploads cache
COPY cache/ ./cache/
COPY uploads/ ./uploads/

EXPOSE 3001

# Entrypoint migrates + seeds the DB, then launches gunicorn (single worker —
# the app holds shared in-memory state).
CMD ["./entrypoint.sh"]
