# Revo Coffee

## What This Is
Revo Coffee is a web application transitioning from a static frontend-only SPA to a robust, Dockerized microservices architecture. It provides an e-commerce platform for customers to browse and purchase coffee products, alongside a completely isolated administration panel for inventory and order management.

## Core Value
Providing a seamless coffee shopping experience backed by a highly scalable, multi-language microservices backend.

## Requirements

### Validated
- ✓ Frontend UI components for shopping, cart, checkout, and user authentication flows.
- ✓ Frontend UI components for the admin dashboard.
- ✓ Multi-language support (i18n - English and Vietnamese).
- ✓ State management for frontend user session and cart data.

### Active
- [ ] Implement an API Gateway to route requests to backend microservices.
- [ ] Deploy a single MySQL server instance to manage data for all services.
- [ ] Implement Backend Microservices:
  - **Auth, User & Cart Service** (PHP Laravel)
  - **Product & Inventory Service** (C# .NET)
  - **Order & Checkout Service** (Java Spring Boot)
- [ ] Separate the Admin panel to run on an isolated port, consuming a dedicated admin API.
- [ ] Containerize the entire application stack (Frontend, API Gateway, Microservices, Database) using a unified `docker-compose.yml`.
- [ ] Integrate frontend React application with the backend APIs via the API Gateway to replace mocked data.

### Out of Scope
- [MongoDB] — Replacing MongoDB with a relational database (MySQL) to better support structured transactional data.

## Context
- The project currently exists as a React 19 SPA built with Vite and Tailwind CSS.
- It currently relies on static data (`products.js`) with no real backend integration.
- The new architectural direction embraces polyglot microservices, allowing different services to be written in the most suitable language (Java, C#, PHP).
- All deployments will be standardized via Docker for consistency across development and production environments.

## Constraints
- **Tech Stack**: Backend must utilize a mix of Java, C#, and PHP. Database must be MySQL.
- **Deployment**: Must be fully Dockerized.
- **Security/Architecture**: Admin interface must be deployed on a separate port from the public-facing application.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Switch from MongoDB to MySQL | Relational data integrity for e-commerce transactions | — Pending |
| Polyglot Microservices | Leverage specific strengths of Java, C#, and PHP for different domain services | — Pending |
| Docker Containerization | Simplify deployment and orchestration of multiple microservices | — Pending |
| Port Isolation for Admin | Improve security and separation of concerns | — Pending |

---
*Last updated: 2026-04-24 after initialization*

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state
