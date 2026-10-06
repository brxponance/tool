"""Local MCP server exposing the PC Tool's data to Claude Desktop.

Excluded from the deployed image by construction: the backend Dockerfile
copies `*.py` (a top-level glob) plus `db/` and `migrations/` only, so this
package is version-controlled but never built into the container.
"""
