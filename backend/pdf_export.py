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

# US Letter LANDSCAPE at 150 DPI, with a modest margin (0.35in, as the old
# print CSS used). Landscape since 2026-09-09 — the report sheet is laid out
# 1240px wide (see .rpt-sheet) so the wide holdings / exposures tables fit.
_DPI = 150
_PAGE_W = int(11.0 * _DPI)
_PAGE_H = int(8.5 * _DPI)
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

    Each image is scaled to fit the printable area (preserving aspect ratio)
    and placed at the top of its own Letter-landscape page. Every sheet is
    captured at the same width, so the width-fit factor is identical for all
    pages and type size is constant; only a page too tall for the sheet
    (a long peer-group table) shrinks further. A single common factor across
    pages was tried (2026-09-09) and reverted (2026-09-10): one tall page
    shrank the whole document.

    Returns the PDF as bytes. Raises ValueError if no image could be decoded.
    """
    avail_w = _PAGE_W - 2 * _MARGIN
    avail_h = _PAGE_H - 2 * _MARGIN

    sources = [img for img in (_decode(u) for u in (images or [])) if img is not None]
    if not sources:
        raise ValueError('No report page images could be decoded.')

    pages = []
    for src in sources:
        scale = min(avail_w / src.width, avail_h / src.height)
        new_w = max(1, int(src.width * scale))
        new_h = max(1, int(src.height * scale))
        resized = src.resize((new_w, new_h), Image.LANCZOS)
        page = Image.new('RGB', (_PAGE_W, _PAGE_H), 'white')
        page.paste(resized, ((_PAGE_W - new_w) // 2, _MARGIN))
        pages.append(page)

    buf = io.BytesIO()
    pages[0].save(buf, format='PDF', save_all=True,
                  append_images=pages[1:], resolution=float(_DPI))
    return buf.getvalue()
