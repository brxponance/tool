import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
from pypdf import PdfReader

path = sys.argv[1]
start = int(sys.argv[2]) - 1
end = int(sys.argv[3])
r = PdfReader(path)
for i in range(start, min(end, len(r.pages))):
    print(f"=== PAGE {i+1} ===")
    print(r.pages[i].extract_text())
    print()
