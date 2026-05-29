FROM python:3.11-slim

WORKDIR /app

# Install dependencies first (cached layer)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt gunicorn boto3

# Copy application code
COPY *.py .

# Create directories for cache (uploads go to S3 in prod)
RUN mkdir -p uploads cache

# Expose Flask port
EXPOSE 3001

# Run with gunicorn — single worker required (shared in-memory state)
CMD ["gunicorn", "--workers", "1", "--bind", "0.0.0.0:3001", "--timeout", "120", "--access-logfile", "-", "app:app"]
