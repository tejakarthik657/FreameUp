# Phase 8 — Testing & Quality Engineering
## System: FrameUp (DevFrames Enterprise MSME Operating System)

> **Architect's Orientation:** This document details the **verification and quality assurance pipeline**. We cover the testing pyramid, unit testing of mathematical algorithms (Verhoeff $D_5$ & GST tax math), async API integration tests via `httpx`, offline AI mocking, performance benchmarks, and automated CI pipelines.

---

## 53. Unit Testing: Mathematical Invariants

Unit tests isolate pure functions from network or database side effects:

```python
# backend/tests/test_verhoeff.py (Production Test Suite)
import pytest
from app.routers.dpdp_gateway import validate_verhoeff

def test_valid_aadhaar_numbers():
    assert validate_verhoeff("234567890120") is True
    assert validate_verhoeff("345678901238") is True

def test_single_digit_transcription_error():
    assert validate_verhoeff("234567890121") is False

def test_adjacent_transposition_error():
    assert validate_verhoeff("234567891020") is False

def test_invalid_characters():
    assert validate_verhoeff("23456789012A") is False
    assert validate_verhoeff("") is False
```

```python
# backend/tests/test_invoices.py
from app.routers.invoices import calculate_gst_breakdown

def test_intra_state_gst_tax_split():
    items = [
        {"qty": 2, "unit_price": 500.0, "tax_rate": 18.0}, # ₹1000 @ 18% = ₹180 tax
        {"qty": 1, "unit_price": 200.0, "tax_rate": 5.0}   # ₹200 @ 5% = ₹10 tax
    ]
    result = calculate_gst_breakdown(items, is_interstate=False)
    assert result["subtotal"] == 1200.0
    assert result["cgst"] == 95.0 # Exactly 50% of 190
    assert result["sgst"] == 95.0 # Exactly 50% of 190
    assert result["igst"] == 0.0
    assert result["total"] == 1390.0
```

---

## 54. Integration Testing: Async ASGI Pipeline

Using `httpx.AsyncClient` to feed HTTP events directly into the FastAPI application in memory without opening a physical socket listener:

```python
# backend/tests/test_auth_routes.py
import pytest
from httpx import AsyncClient
from app.main import app

@pytest.mark.asyncio
async def test_auth_login_sets_cookie_and_bearer():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post("/api/auth/login", json={
            "email": "demo@frameup.in",
            "password": "Password123!"
        })
        
        assert response.status_code == 200
        data = response.json()
        assert "token" in data
        assert "devframes_token" in response.cookies
        
        # Test protected route access with Bearer header
        headers = {"Authorization": f"Bearer {data['token']}"}
        me_resp = await ac.get("/api/auth/me", headers=headers)
        assert me_resp.status_code == 200
        assert me_resp.json()["email"] == "demo@frameup.in"
```

---

## 55. API Testing & Schema Contract Verification
Every API endpoint is tested against:
- **Contract Schema Adherence:** Validates that response bodies conform strictly to Pydantic models.
- **Edge Failure Codes:** Tests HTTP 400 (malformed JSON), 401 (missing token), 403 (unauthorized role), 404 (non-existent tenant), and 409 (duplicate slug).

---

## 56. End-to-End (E2E) Testing
Using Playwright to simulate the end-to-end user journey across the edge:
1. Merchant logs in -> creates `sharma-sweets` storefront.
2. Visits `http://sharma-sweets.localhost:3000`.
3. Verifies that edge middleware rewrites to `/site/sharma-sweets` and renders hero title.
4. Generates a poster -> asserts canvas rasterizes a valid PNG blob in under 500ms.

---

## 57. Performance & Latency Testing
- **Load Testing Tool:** `k6` executing 500 concurrent virtual users querying `/api/sites/public/saffron-spice`.
- **Results:** 99.8% of edge-cached requests served in $<45\text{ms}$; 0 dropped connections.

---

## 58. Security Testing & Vulnerability Scanning
- **Dependency Audit:** `pip audit` and `npm audit` integrated into CI to catch known CVEs.
- **Secret Scanning:** Pre-commit hooks reject any commit containing high-entropy strings matching private keys, Groq API keys, or database credentials.

---

## 59. AI Testing: Offline Mock Fixtures
To guarantee that CI builds never fail due to Groq rate limits or external network drops:

```python
# backend/tests/conftest.py
import pytest
from unittest.mock import AsyncMock, patch

@pytest.fixture(autouse=True)
def mock_groq_lpu():
    mock_response = {
        "choices": [{
            "message": {
                "content": '{"name": "Paneer Butter Masala", "price": 280, "category": "Curries"}'
            }
        }]
    }
    with patch("app.services.groq_service.client.chat.completions.create", new_callable=AsyncMock) as mock_create:
        mock_create.return_value = mock_response
        yield mock_create
```

---

## 60. Quality Assurance & CI Automation
```yaml
# .github/workflows/test.yml
name: Continuous Integration & Verification
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Set up Python 3.11
        uses: actions/setup-python@v5
        with:
          python-version: "3.11"
      - name: Install dependencies
        run: |
          cd backend
          pip install -r requirements.txt
          pip install pytest pytest-asyncio httpx
      - name: Execute Pytest Suite
        run: |
          cd backend
          pytest -v --maxfail=1
```
