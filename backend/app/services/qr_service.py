"""Section 7.1: QR generation via a Python QR library, on demand or cached."""
import io
import base64
import qrcode


def generate_qr_data_url(url: str) -> str:
    """Returns a base64 data: URL so the frontend can render it directly with no extra file storage needed."""
    img = qrcode.make(url)
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    encoded = base64.b64encode(buf.getvalue()).decode("utf-8")
    return f"data:image/png;base64,{encoded}"
