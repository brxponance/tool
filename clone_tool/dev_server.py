"""
Dev launcher — runs the tool with auto-reload ON.

  python dev_server.py

Auto-reloads the backend when any .py file changes (Werkzeug reloader) and,
with debug mode on, the frontend live-reload endpoint (/__livereload) lets the
browser refresh itself when source files change. Use run.py for a plain
(no-reload) launch.
"""
import os
import threading
import time
import webbrowser

from app import app

# IMPORTANT: always use http://127.0.0.1:3001, NOT http://localhost:3001.
# On this machine 'localhost' resolves to IPv6 ::1 first, which is silently
# dropped, so every HTTP request waits ~2s before falling back to IPv4. The
# Portfolio tab fires ~12 requests per switch, so that tax turns a ~0.5s
# refresh into several seconds. 127.0.0.1 skips it entirely.
URL = 'http://127.0.0.1:3001'


def _open_browser():
    time.sleep(2)          # give the reloader's child time to bind the port
    webbrowser.open(URL)


if __name__ == '__main__':
    # Open the browser once, from the reloader's PARENT/supervisor process
    # (WERKZEUG_RUN_MAIN is unset there). The child re-execs on every code
    # reload with WERKZEUG_RUN_MAIN='true', so this guard avoids popping a new
    # tab on each auto-reload.
    if os.environ.get('WERKZEUG_RUN_MAIN') != 'true':
        print(f"\n  Aapryl Clone Tool (dev / auto-reload) — open {URL}\n")
        threading.Thread(target=_open_browser, daemon=True).start()
    # host='127.0.0.1' = loopback only: reachable from THIS machine only, never
    # from the local network. (Use '0.0.0.0' only if you intentionally want to
    # expose it to other devices — the app has no authentication.)
    app.run(host='127.0.0.1', port=3001, debug=True, use_reloader=True)
