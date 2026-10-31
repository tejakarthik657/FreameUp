# 20. Engineering Workflow, Git Governance & Standards

## 20. Engineering Workflow

### 20.1 Git Branching Strategy & Lifecycle
FrameUp adheres to a structured Trunk-Based Development model with short-lived feature branches:

```
[main] (Production: deployed to Vercel & Render)
  ^
  | Pull Request (requires passing CI + code review)
[feature/xxx] (Short-lived topic branches)
```

- `main`: Represents production-ready code. Commits merged to `main` trigger automated GitHub Actions deployment pipelines to Vercel and Render.
- `feature/<ticket-id>-<slug>`: Feature branches created off `main`, merged via Pull Request after linting, testing, and approval.

---

### 20.2 Conventional Commit Standards
All git commit messages are validated against the Conventional Commits specification:

```
<type>(<scope>): <short description in imperative mood>

[optional body describing architectural rationale]

[optional footer with breaking changes or issue links]
```

#### Allowed Types:
- `feat`: A new user-facing capability or API route (e.g. `feat(importer): add Groq vision menu parsing`).
- `fix`: A bug fix (e.g. `fix(cors): preserve access-control headers on 500 exceptions`).
- `perf`: A code change that improves performance (e.g. `perf(posters): shift rasterization to client canvas`).
- `sec`: Security and compliance updates (e.g. `sec(dpdp): implement Verhoeff D5 checksum`).
- `refactor`: Code restructuring without functional change.
- `test`: Adding or refactoring test suites.
- `docs`: Documentation additions or updates.

---

### 20.3 Pull Request Verification & Quality Gates
Every Pull Request must satisfy the following automated CI quality gates:
1. **Linting & Formatting:** ESLint & Prettier for TypeScript/React; Black & Flake8 for Python.
2. **Type Safety:** Zero TypeScript compiler errors (`tsc --noEmit`); Pydantic v2 strict typing.
3. **Automated Testing:** Pytest unit and integration suite must pass with 100% success rate.
4. **Security Scan:** Git pre-commit hooks check for hardcoded secrets, JWT keys, and API credentials.
