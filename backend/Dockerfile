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

# Runtime data directories. uploads/ and cache/ are NOT baked into the image
# (they're gitignored runtime data): uploaded workbooks come from S3, and the
# analytical cache (results.pkl) is rebuilt on the first /run. Create them empty
# so the app has somewhere to write. To ship a warm cache, drop a
# results.pkl into cache/ before building (and un-ignore it), but it's optional.
RUN mkdir -p uploads cache

EXPOSE 3001

# Entrypoint migrates + seeds the DB, then launches gunicorn (single worker —
# the app holds shared in-memory state).
CMD ["./entrypoint.sh"]
