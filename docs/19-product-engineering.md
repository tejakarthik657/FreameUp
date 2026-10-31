# 19. Product Engineering & Indian MSME Operational Fit

## 19. Product Engineering

### 19.1 Designing for Indian MSME Mental Models
Western SaaS products (Shopify, HubSpot, Salesforce) are designed around desktop dashboards, formal procurement departments, and credit card subscriptions. In contrast, Indian MSME business owners operate under fundamentally different constraints:
1. **Mobile-First Realities:** The business owner's smartphone is their primary computing terminal. Over 88% of daily store management occurs on Android devices under uneven lighting while attending to in-person walk-ins.
2. **Conversational Commerce:** Customer acquisition and support do not occur via email tickets; they occur via WhatsApp messages, voice notes, and UPI payment screenshots.
3. **Friction Intolerance:** Any setup process requiring more than 3 steps or manual data entry of 50+ items produces immediate churn.

---

### 19.2 The "Zero-Effort Onboarding" Engine
To solve the onboarding drop-off crisis, FrameUp eliminated traditional multi-page registration wizards in favor of a 60-second wedge:
```
+-----------------------------------------------------------------------------------+
| THE 60-SECOND ONBOARDING FUNNEL                                                   |
+-----------------------------------------------------------------------------------+
| [1. Business Name & Vertical]   -> Name + Select: Restaurant / Salon / Services   |
| [2. Upload Paper Menu / Bill]   -> Snap phone camera photo of physical menu/bill  |
| [3. AI Auto-Extraction (Groq)]  -> 1.8s background extraction into clean catalog   |
| [4. Instant Subdomain Issued]   -> Live at <business-slug>.frameup.in             |
+-----------------------------------------------------------------------------------+
```

---

### 19.3 Vernacular Localization & Multilingual Support
Over 70% of Indian MSME merchants prefer regional languages for daily inventory and accounting. FrameUp integrates a dynamic translation and localization layer (`backend/app/routers/localization.py`):
- Supports instant switching across English, Hindi, and regional scripts.
- Preserves domain-specific vernacular vocabulary (e.g., distinguishing between "Thali", "Bihari Litti Chokha", "Katori", and generic "Dish").
- Formats currency natively into the Indian numbering system:
  $$\text{₹1,00,000 (1 Lakh)} \quad \text{vs} \quad \text{\$100,000 (100 Thousand)}$$

---

### 19.4 Compliance as a Product Wedge
Instead of pitching abstract "cloud software", FrameUp leads with statutory immunity under the **Digital Personal Data Protection (DPDP) Act 2023**. Small salons and clinic owners are terrified of customer data leak liability. By offering an automated DPDP consent collection badge and cryptographic audit logs, FrameUp converts legal anxiety into organic customer acquisition.
