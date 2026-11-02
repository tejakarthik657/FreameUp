# FrameUp Engineering Masterclass & Technical Documentation Suite

> **"Your objective should not be to build an application that merely works. Your objective should be to understand an application so thoroughly that you can explain every architectural decision, write the entire application from an empty repository, debug failures without depending on AI, and defend your engineering against any CTO in the world."**

Welcome to the **FrameUp (DevFrames Enterprise OS)** Engineering Documentation Suite. 

This repository of 23 specialized engineering handbooks has been refactored from first principles to be **human-readable, deeply engaging, and uncompromisingly technical**. It bridges the gap between high-level business vision and bare-metal systems execution.

---

## 🧭 The 23-Module Engineering Roadmap

```mermaid
graph TD
    subgraph Product & Vision
        D01["01. Project Overview & Human Story"]
        D02["02. Requirements Engineering"]
        D19["19. Product Engineering & Indian MSMEs"]
    end

    subgraph Architecture & Decisions
        D03["03. System Architecture & Packet Life"]
        D04["04. Technology Stack & Defenses"]
        D05["05. Codebase Organization & Tour"]
        D12["12. Distributed Systems & Sync"]
        D17["17. Architecture Decision Records (ADRs)"]
    end

    subgraph Persistence Layer
        D06["06. Database Design & MongoDB Engine"]
    end

    subgraph Application & Edge
        D07["07. Backend Engineering & ASGI Lifecycle"]
        D08["08. API Design & 80+ Route Directory"]
        D09["09. Frontend Architecture & Edge Engine"]
    end

    subgraph Security & Intelligence
        D10["10. Security Architecture & Verhoeff D5"]
        D18["18. AI Engineering & Groq LPU"]
    end

    subgraph Reliability, DevOps & Ownership
        D11["11. Performance & Scalability"]
        D13["13. Testing Strategy & Pytest"]
        D14["14. DevOps & Production Docker"]
        D15["15. Observability & Post-Mortem INC-2026"]
        D16["16. Reliability & Circuit Breakers"]
        D20["20. Engineering Workflow & Git"]
        D21["21. Developer Setup & /etc/hosts"]
        D22["22. Top 5 Production Bugs Solved"]
        D23["23. Interview Mastery & 12-Pt Jarvis Test"]
    end

    D01 --> D02 --> D03
    D03 --> D04 --> D05 --> D06 --> D07 --> D08 --> D09
    D09 --> D10 --> D18 --> D11 --> D13 --> D14 --> D15 --> D16
    D16 --> D17 --> D19 --> D20 --> D21 --> D22 --> D23
```

---

## 📚 Direct Access by Engineering Domain

### 1. Product & Domain Strategy
- **[01. Project Overview & The Human Story](file:///c:/Programming/Projects/05_Social-Impact/template_hub/devframes/docs/01-project-overview.md)** — *Why we built this for Rajesh Sharma's sweet shop, solving the ₹40,000/mo SaaS fragmentation tax.*
- **[02. Requirements Engineering](file:///c:/Programming/Projects/05_Social-Impact/template_hub/devframes/docs/02-requirements-engineering.md)** — *Translating MSME operational chaos into 8 core software invariants and edge cases.*
- **[19. Product Engineering & Indian MSMEs](file:///c:/Programming/Projects/05_Social-Impact/template_hub/devframes/docs/19-product-engineering.md)** — *Designing for the budget Android mental model, 60-second onboarding, and DPDP compliance as a growth wedge.*

### 2. System Architecture & Decisions
- **[03. System Architecture & The Life of a Packet](file:///c:/Programming/Projects/05_Social-Impact/template_hub/devframes/docs/03-system-architecture.md)** — *Decoupled edge micro-monolith, C4 context models, and tracing an incoming packet from Mumbai to Vercel and Render.*
- **[04. Technology Stack & Architectural Defenses](file:///c:/Programming/Projects/05_Social-Impact/template_hub/devframes/docs/04-technology-stack.md)** — *Defending every technology choice: FastAPI vs Go, MongoDB vs Postgres, Groq vs OpenAI, and canvas vs Puppeteer.*
- **[05. Codebase Organization & Guided Tour](file:///c:/Programming/Projects/05_Social-Impact/template_hub/devframes/docs/05-codebase-organization.md)** — *The three code islands, file-by-file accountability, and the 3 inviolable architectural boundary rules.*
- **[12. Distributed Systems & Cross-Tier Coordination](file:///c:/Programming/Projects/05_Social-Impact/template_hub/devframes/docs/12-distributed-systems.md)** — *Balancing strong consistency for invoices with eventual consistency (ISR) for public storefronts; idempotency keys.*
- **[17. Architecture Decision Records (ADRs)](file:///c:/Programming/Projects/05_Social-Impact/template_hub/devframes/docs/17-engineering-decision-records.md)** — *The 5 foundational ADRs formatted according to the Michael Nygard standard.*

### 3. Persistence & Database Design
- **[06. Database Design & Persistence Architecture](file:///c:/Programming/Projects/05_Social-Impact/template_hub/devframes/docs/06-database-design.md)** — *The 10 core MongoDB collections, compound indexes, explain plans, and real-time GST aggregation pipelines.*

### 4. Application Engineering (Backend & API)
- **[07. Backend Engineering & Request Lifecycle](file:///c:/Programming/Projects/05_Social-Impact/template_hub/devframes/docs/07-backend-engineering.md)** — *ASGI event loops, uvloop concurrency, dynamic CORS regex, and the Dual-Auth security dependency guard.*
- **[08. API Design & Complete Route Directory](file:///c:/Programming/Projects/05_Social-Impact/template_hub/devframes/docs/08-api-design.md)** — *Complete directory of 80+ REST endpoints across 18 routers with request/response contracts and RFC 7807 error handling.*

### 5. Frontend & Edge Engineering
- **[09. Frontend Architecture & Edge Subdomains](file:///c:/Programming/Projects/05_Social-Impact/template_hub/devframes/docs/09-frontend-architecture.md)** — *Vercel edge middleware URL rewriting, React Server Components shipping 0 KB client JS, and 18 pure CSS poster templates.*

### 6. Security, Compliance & AI Systems
- **[10. Security Architecture & DPDP Act 2023](file:///c:/Programming/Projects/05_Social-Impact/template_hub/devframes/docs/10-security-architecture.md)** — *The mathematical beauty of the Verhoeff Dihedral Checksum ($D_5$), Aadhaar validation, ephemeral PII vault, and SHA-256 audit ledger.*
- **[18. AI Engineering & Groq LPU Orchestration](file:///c:/Programming/Projects/05_Social-Impact/template_hub/devframes/docs/18-ai-engineering.md)** — *Groq Tensor Streaming Architecture (400+ tok/s), hardware JSON grammar constraints, in-flight PII scrubber, and token economics.*

### 7. Reliability, Quality, DevOps & Interview Mastery
- **[11. Performance & Scalability Engineering](file:///c:/Programming/Projects/05_Social-Impact/template_hub/devframes/docs/11-performance-and-scalability.md)** — *The 800ms mobile latency budget, Puppeteer vs canvas memory benchmark (0 MB RAM), and MongoDB execution stats.*
- **[13. Testing Strategy & Verification Pipeline](file:///c:/Programming/Projects/05_Social-Impact/template_hub/devframes/docs/13-testing-strategy.md)** — *Pytest test pyramid, unit testing Verhoeff and GST tax splits, async HTTP route tests, and offline AI mocks.*
- **[14. DevOps, Infrastructure & Production Deployment](file:///c:/Programming/Projects/05_Social-Impact/template_hub/devframes/docs/14-devops-and-deployment.md)** — *Production multi-stage Dockerfile, Render dynamic $PORT binding, Vercel edge deployment, and health probes.*
- **[15. Production Observability & Incident Post-Mortems](file:///c:/Programming/Projects/05_Social-Impact/template_hub/devframes/docs/15-production-observability.md)** — *Structured JSON logging, correlation IDs, and the full 5 Whys Root Cause Analysis of Incident INC-2026-08A.*
- **[16. Reliability Engineering & Fault Tolerance](file:///c:/Programming/Projects/05_Social-Impact/template_hub/devframes/docs/16-reliability-engineering.md)** — *Circuit breaker state machine (Closed/Open/Half-Open), exponential backoff with full jitter, and graceful degradation tiers.*
- **[20. Engineering Workflow & Git Governance](file:///c:/Programming/Projects/05_Social-Impact/template_hub/devframes/docs/20-engineering-workflow.md)** — *Trunk-based development, conventional commit standards, and automated PR quality gates.*
- **[21. Developer Guide & Local Setup Runbook](file:///c:/Programming/Projects/05_Social-Impact/template_hub/devframes/docs/21-developer-guide.md)** — *Local workstation bootstrapping, Python virtual environments, and testing wildcard subdomains via `/etc/hosts`.*
- **[22. Deep-Dive Engineering Challenges](file:///c:/Programming/Projects/05_Social-Impact/template_hub/devframes/docs/22-engineering-challenges.md)** — *Root-cause analyses of the 5 hardest bugs we solved (Render CORS masking, canvas font clipping, third-party cookies, etc.).*
- **[23. Technical Interview Preparation & Project Ownership](file:///c:/Programming/Projects/05_Social-Impact/template_hub/devframes/docs/23-interview-preparation.md)** — *The 30-sec, 60-sec, and 3-min whiteboard pitches, the **12-Point Jarvis Readiness Test**, and tough CTO interview defenses.*

---

## 🎓 Recommended 8-Day Study Plan

If you have 8 days to study this system (spending 1.5 to 2 hours per day):
- **Day 1:** Modules 01, 02, and 19 (Product, Personas, Indian MSME Mindset)
- **Day 2:** Modules 03, 04, and 05 (System Architecture, Tech Trade-Offs, Codebase Tour)
- **Day 3:** Modules 06, 07, and 08 (Database Design, FastAPI ASGI Lifecycle, REST API)
- **Day 4:** Modules 09 and 11 (Frontend Edge Subdomains, RSC, Pure CSS Posters, Performance)
- **Day 5:** Modules 10 and 18 (Verhoeff $D_5$ Algorithm, DPDP Act Vault, Groq LPUs)
- **Day 6:** Modules 12, 13, and 16 (Distributed Consistency, Pytest Suite, Circuit Breakers)
- **Day 7:** Modules 14, 15, and 17 (Production Docker, Incident INC-2026-08A Postmortem, ADRs)
- **Day 8:** Modules 20, 21, 22, and 23 (The 5 Toughest Bugs, The 12-Point Jarvis Test & Final Pitch Mastery)
