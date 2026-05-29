"""
s3_storage.py — Optional S3 backend for file uploads.

When S3_BUCKET env var is set, uploaded files are stored in S3 and
downloaded to a local temp path before being read by the engines.
When S3_BUCKET is not set, behaves as a no-op and local disk is used
(preserves local dev workflow unchanged).
"""
import os
import tempfile

S3_BUCKET = os.environ.get('S3_BUCKET', '')
S3_PREFIX = os.environ.get('S3_PREFIX', 'uploads/')

_s3_client = None

def _client():
    global _s3_client
    if _s3_client is None:
        import boto3
        _s3_client = boto3.client('s3')
    return _s3_client

def is_enabled():
    return bool(S3_BUCKET)

def upload_file(local_path: str, key: str) -> str:
    """Upload a local file to S3. Returns the S3 key."""
    if not is_enabled():
        return local_path
    s3_key = f"{S3_PREFIX}{key}"
    _client().upload_file(local_path, S3_BUCKET, s3_key)
    print(f"[s3] uploaded {local_path} → s3://{S3_BUCKET}/{s3_key}")
    return s3_key

def download_file(key: str, suffix: str = '') -> str:
    """Download an S3 file to a temp path and return the local path.
    If S3 is not enabled, returns the key as-is (it's already a local path)."""
    if not is_enabled():
        return key
    s3_key = key if key.startswith(S3_PREFIX) else f"{S3_PREFIX}{key}"
    tmp = tempfile.NamedTemporaryFile(delete=False, suffix=suffix)
    tmp.close()
    _client().download_file(S3_BUCKET, s3_key, tmp.name)
    print(f"[s3] downloaded s3://{S3_BUCKET}/{s3_key} → {tmp.name}")
    return tmp.name

def save_uploaded_file(file_storage, filename: str, upload_folder: str) -> str:
    """Save a werkzeug FileStorage object. Goes to S3 if enabled, local disk
    otherwise. Returns the path/key to store in state['files']."""
    local_path = os.path.join(upload_folder, filename)
    file_storage.save(local_path)
    if is_enabled():
        s3_key = upload_file(local_path, filename)
        os.unlink(local_path)  # remove temp local copy
        return s3_key
    return local_path

def resolve_path(path_or_key: str, upload_folder: str, suffix: str = '.xlsx') -> str:
    """Given a stored path/key, return a local path ready to open.
    Downloads from S3 if needed. Falls back to local path resolution."""
    if not is_enabled():
        # Local mode — try as-is, then basename fallback
        if os.path.exists(path_or_key):
            return path_or_key
        basename = os.path.basename(path_or_key)
        alt = os.path.join(upload_folder, basename)
        return alt if os.path.exists(alt) else path_or_key
    # S3 mode
    if path_or_key.startswith(S3_PREFIX) or not os.path.exists(path_or_key):
        return download_file(path_or_key, suffix=suffix)
    return path_or_key
