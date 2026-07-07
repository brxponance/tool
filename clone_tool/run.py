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
    print("  Starting server at http://localhost:3001")
    print("  Press Ctrl+C to stop")
    print("="*50 + "\n")

    # Open browser after short delay
    def open_browser():
        time.sleep(2)
        webbrowser.open('http://localhost:3001')

    import threading
    threading.Thread(target=open_browser, daemon=True).start()

    # Start Flask
    from app import app
    app.run(host='0.0.0.0', port=3001, debug=False)
