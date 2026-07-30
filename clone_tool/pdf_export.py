"""
PDF export for the Reports tab — "Quarterly Portfolio Report" button.

Mirrors the PPTX memo export (pptx_export.py) but produces a PDF. The frontend
captures each report page as a PNG via html2canvas and POSTs the data URLs;
this module decodes them and writes one image per PDF page (US Letter portrait).

Pillow does the PDF assembly. Pillow is already installed as a dependency of
python-pptx, so this adds no new requirement.
"""
import base64
import io

from PIL import Image

# US Letter portrait at 150 DPI, with a modest margin (matches the old print CSS
# @page margin of 0.35in).
_DPI = 150
_PAGE_W = int(8.5 * _DPI)
_PAGE_H = int(11.0 * _DPI)
_MARGIN = int(0.35 * _DPI)


def _decode(data_url):
    """Decode a 'data:image/png;base64,...' URL (or bare base64) to an RGB image."""
    if not data_url:
        return None
    s = data_url
    if s.strip().startswith('data:') and ',' in s:
        s = s.split(',', 1)[1]
    try:
        img = Image.open(io.BytesIO(base64.b64decode(s)))
        img.load()
        return img.convert('RGB')
    except Exception:
        return None


def build_report_pdf(images, meta=None):
    """Assemble a PDF from an ordered list of PNG data URLs (one per report page).

    Each image is scaled to fit within the printable area (preserving aspect
    ratio) and placed at the top of its own Letter-portrait page.

    Returns the PDF as bytes. Raises ValueError if no image could be decoded.
    """
    avail_w = _PAGE_W - 2 * _MARGIN
    avail_h = _PAGE_H - 2 * _MARGIN

    pages = []
    for data_url in (images or []):
        src = _decode(data_url)
        if src is None:
            continue
        scale = min(avail_w / src.width, avail_h / src.height)
        new_w = max(1, int(src.width * scale))
        new_h = max(1, int(src.height * scale))
        resized = src.resize((new_w, new_h), Image.LANCZOS)
        page = Image.new('RGB', (_PAGE_W, _PAGE_H), 'white')
        page.paste(resized, ((_PAGE_W - new_w) // 2, _MARGIN))
        pages.append(page)

    if not pages:
        raise ValueError('No report page images could be decoded.')

    buf = io.BytesIO()
    pages[0].save(buf, format='PDF', save_all=True,
                  append_images=pages[1:], resolution=float(_DPI))
    return buf.getvalue()
