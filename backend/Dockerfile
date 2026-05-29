FROM python:3.11-slim

WORKDIR /app

# Install dependencies first (cached layer)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt gunicorn boto3

# Copy application code
COPY *.py .

# Create directories and bake in the complete local cache snapshot.
# The Flask app always loads /app/cache/results.pkl at startup. The deploy
# snapshot is copied from results.pkl.backup and includes the universe clone
# results + normalized skill data that the smaller active local cache lacks.
RUN mkdir -p uploads cache
COPY cache/results.deploy.pkl ./cache/results.pkl
COPY uploads/ ./uploads/

# Expose Flask port
EXPOSE 3001

# Run with gunicorn — single worker required (shared in-memory state)
CMD ["gunicorn", "--workers", "1", "--bind", "0.0.0.0:3001", "--timeout", "120", "--access-logfile", "-", "app:app"]
