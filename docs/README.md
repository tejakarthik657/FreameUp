# FrameUp Technical Documentation Suite

## Enterprise Engineering Architecture & Production Systems Reference

Welcome to the definitive, bifurcated technical documentation suite for **FrameUp (DevFrames Enterprise OS)**. 
Every perspective, layer, and engineering vertical of this production system has been separated into its own dedicated `.md` file in `docs/` according to the **Complete Production-Grade Project Documentation Structure**.

---

## 🧭 Master Documentation Index (23 Dedicated Categories)

### 1. Product & Domain Strategy
- **[01. Project Overview & Product Understanding](file:///c:/Programming/Projects/05_Social-Impact/template_hub/devframes/docs/01-project-overview.md)**  
  *Macro problem of the Indian MSME SaaS fragmentation tax, product vision, target personas (Rajesh, Priya, Vikram), value proposition, and release 2.4.0 scope.*
- **[02. Requirements Engineering](file:///c:/Programming/Projects/05_Social-Impact/template_hub/devframes/docs/02-requirements-engineering.md)**  
  *Comprehensive Functional Requirements (FR-01 to FR-08), Non-Functional Requirements (P1-P3, S1-S4, A1-A2), user journeys, edge cases, and failure modes.*
- **[19. Product Engineering & MSME Operational Fit](file:///c:/Programming/Projects/05_Social-Impact/template_hub/devframes/docs/19-product-engineering.md)**  
  *Designing for Indian MSME mental models, zero-effort mobile onboarding funnels, vernacular localization, and compliance-led product acquisition.*

---

### 2. Architecture & High-Level System Design
- **[03. System Architecture & Topologies](file:///c:/Programming/Projects/05_Social-Impact/template_hub/devframes/docs/03-system-architecture.md)**  
  *Decoupled edge-accelerated micro-monolith, C4 context diagrams, edge subdomain resolution flow, and read/write transactional pipelines.*
- **[04. Technology Stack & Engineering Trade-Offs](file:///c:/Programming/Projects/05_Social-Impact/template_hub/devframes/docs/04-technology-stack.md)**  
  *Complete tech matrix, FastAPI vs Go/Node, MongoDB Atlas vs PostgreSQL, Groq LPUs vs OpenAI, and client canvas vs server Puppeteer.*
- **[05. Codebase Organization & Architecture Boundaries](file:///c:/Programming/Projects/05_Social-Impact/template_hub/devframes/docs/05-codebase-organization.md)**  
  *Physical repository structure, backend and frontend boundaries, layer isolation rules, and directory accountability.*
- **[12. Distributed Systems & Cross-Tier Coordination](file:///c:/Programming/Projects/05_Social-Impact/template_hub/devframes/docs/12-distributed-systems.md)**  
  *Edge-to-origin sync, Raft replica set consensus, eventual consistency via Next.js ISR, and distributed transaction safety.*
- **[17. Architecture Decision Records (ADRs)](file:///c:/Programming/Projects/05_Social-Impact/template_hub/devframes/docs/17-engineering-decision-records.md)**  
  *Formal Michael Nygard ADRs: ADR-001 (MongoDB), ADR-002 (Decoupled Next.js/FastAPI), ADR-003 (Pure CSS Posters), ADR-004 (Verhoeff $D_5$), ADR-005 (Dual-Auth).*

---

### 3. Data Architecture & Persistence
- **[06. Database Design & Persistence Models](file:///c:/Programming/Projects/05_Social-Impact/template_hub/devframes/docs/06-database-design.md)**  
  *ER diagrams, all 10 MongoDB Atlas collections with BSON schemas, compound indexing strategies, and monthly GST aggregation pipelines.*

---

### 4. Application Engineering (Backend & API)
- **[07. Backend Engineering & Request Lifecycle](file:///c:/Programming/Projects/05_Social-Impact/template_hub/devframes/docs/07-backend-engineering.md)**  
  *ASGI Uvicorn request lifecycle, dynamic CORS regex, exception handling preserving CORS, and Dual-Auth (`devframes_token` cookie + Bearer token).*
- **[08. API Design & Complete Route Directory](file:///c:/Programming/Projects/05_Social-Impact/template_hub/devframes/docs/08-api-design.md)**  
  *Complete directory of 80+ REST endpoints across 18 routers with request/response payloads, auth scopes, and RFC 7807 error schemas.*

---

### 5. Frontend & Edge Engineering
- **[09. Frontend Architecture & Edge Subdomains](file:///c:/Programming/Projects/05_Social-Impact/template_hub/devframes/docs/09-frontend-architecture.md)**  
  *Next.js 14 App Router, `middleware.ts` wildcard subdomain rewrites, React Server Components (RSC 0 KB JS), and 18 pure CSS poster templates.*

---

### 6. Security, Compliance & AI Systems
- **[10. Security Architecture & DPDP Act 2023](file:///c:/Programming/Projects/05_Social-Impact/template_hub/devframes/docs/10-security-architecture.md)**  
  *STRIDE threat model, mathematical **Verhoeff Dihedral Checksum ($D_5$)** implementation, Aadhaar verification, ephemeral in-memory PII vault, and SHA-256 audit logs.*
- **[18. AI Engineering & Groq LPU Orchestration](file:///c:/Programming/Projects/05_Social-Impact/template_hub/devframes/docs/18-ai-engineering.md)**  
  *Groq Tensor Streaming Architecture (TSA), hardware-enforced JSON grammar mode, prompt schemas, and 92% cost reduction token economics.*

---

### 7. Reliability, Quality, DevOps & Mastery
- **[11. Performance Optimization & Scalability](file:///c:/Programming/Projects/05_Social-Impact/template_hub/devframes/docs/11-performance-and-scalability.md)**  
  *Latency budgets, browser canvas rasterization vs Puppeteer memory benchmarks, Groq 300+ tok/s metrics, and MongoDB explain plans.*
- **[13. Testing Strategy & Quality Assurance](file:///c:/Programming/Projects/05_Social-Impact/template_hub/devframes/docs/13-testing-strategy.md)**  
  *Test pyramid, Pytest unit tests for Verhoeff & GST math, async HTTP client tests, Groq stubs, and GitHub Actions CI.*
- **[14. DevOps, Infrastructure & Deployment](file:///c:/Programming/Projects/05_Social-Impact/template_hub/devframes/docs/14-devops-and-deployment.md)**  
  *Production Dockerfile, Render dynamic `$PORT` ASGI container, Vercel edge deployment, and environment secrets matrix.*
- **[15. Production Observability & Telemetry](file:///c:/Programming/Projects/05_Social-Impact/template_hub/devframes/docs/15-production-observability.md)**  
  *Structured JSON logging, request correlation IDs, and post-mortem analysis of the Render port & CORS incident (`INC-2026-08A`).*
- **[16. Reliability Engineering & Fault Tolerance](file:///c:/Programming/Projects/05_Social-Impact/template_hub/devframes/docs/16-reliability-engineering.md)**  
  *Circuit breaker implementation, exponential backoff with full jitter, and three-tier graceful degradation hierarchy.*
- **[20. Engineering Workflow & Standards](file:///c:/Programming/Projects/05_Social-Impact/template_hub/devframes/docs/20-engineering-workflow.md)**  
  *Trunk-based Git branching, conventional commit rules, and PR verification quality gates.*
- **[21. Developer Guide & Local Setup Runbook](file:///c:/Programming/Projects/05_Social-Impact/template_hub/devframes/docs/21-developer-guide.md)**  
  *Step-by-step local workstation setup, Python virtual environment, Node setup, and local `/etc/hosts` subdomain testing.*
- **[22. Engineering Challenges & Bug Deep-Dives](file:///c:/Programming/Projects/05_Social-Impact/template_hub/devframes/docs/22-engineering-challenges.md)**  
  *First-principles root-cause analyses (5 Whys) for the 5 toughest bugs encountered in production.*
- **[23. Interview Preparation & Project Ownership](file:///c:/Programming/Projects/05_Social-Impact/template_hub/devframes/docs/23-interview-preparation.md)**  
  *30-sec, 60-sec, and 3-min pitches, hard CTO interview defenses, and the **12-Point Jarvis Project Ownership Readiness Test**.*
