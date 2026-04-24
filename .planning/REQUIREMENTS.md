# Requirements — Revo Coffee Web

Scope
- Frontend: `revo-coffee-react` (React + Vite)
- Backend: `be_revo_coffee` (.NET 9 API)
- Local dev: Docker Compose

Functional requirements
- REQ-01: Product listing and detail pages with search and filters.
- REQ-02: Shopping cart persistence and checkout flow.
- REQ-03: User authentication (register, login, session management).
- REQ-04: Order creation, order history for users.
- REQ-05: Admin area: manage products, batches, inventory, and orders.
- REQ-06: Localization (English, Vietnamese) for UI text.

Non-functional requirements
- Containerized development with `docker-compose.yml`.
- Reasonable performance for catalog pages (<200ms API p95 locally).
- Automated dev start: `npm install && npm run dev` for frontend; `dotnet run` for backend.

Out of scope (initial)
- External payment gateway integration (deferred).
- Full CI/CD pipelines (deferred to ROADMAP phase).
