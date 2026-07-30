"""
Aapryl Clone Tool - Launch Script
Run this file to start the tool: python run.py
Then open your browser to http://localhost:3001
"""
import subprocess
import sys
import os
import webbrowser
import time

def check_and_install():
    """Install dependencies if needed."""
    try:
        import flask, numpy, pandas, sklearn, scipy, openpyxl, rapidfuzz
        print("All dependencies found.")
    except ImportError:
        print("Installing dependencies...")
        subprocess.check_call([sys.executable, '-m', 'pip', 'install', '-r', 'requirements.txt'])
        print("Dependencies installed.")

if __name__ == '__main__':
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    check_and_install()

    print("\n" + "="*50)
    print("  Aapryl Clone Tool")
    print("="*50)
    print("  Starting server at http://127.0.0.1:3001")
    print("  (use 127.0.0.1, NOT localhost — localhost adds a ~2s")
    print("   IPv6-fallback delay to every request on this machine)")
    print("  Press Ctrl+C to stop")
    print("="*50 + "\n")

    # Open browser after short delay. Use 127.0.0.1 (not localhost) to avoid
    # the ~2s-per-request IPv6 (::1) connection-fallback delay on this host.
    def open_browser():
        time.sleep(2)
        webbrowser.open('http://127.0.0.1:3001')

    import threading
    threading.Thread(target=open_browser, daemon=True).start()

    # Start Flask. host='127.0.0.1' = loopback only, so the tool is reachable
    # from THIS machine only and never from the local network. (The app has no
    # authentication; use '0.0.0.0' only if you deliberately want to share it.)
    from app import app
    app.run(host='127.0.0.1', port=3001, debug=False)
