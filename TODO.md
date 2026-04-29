# Revo Coffee Microservices TODO

## Current Architecture

- `apps/customer-web`: customer-facing React app
- `apps/admin-web`: admin React app
- `services/identity-service`: PHP identity API
- `services/product-service`: .NET product/catalog API
- `services/inventory-service`: .NET inventory API
- `services/order-service`: Spring Boot order API
- `services/batch-service`: Spring Boot batch/QC API
- `infra/nginx/nginx.conf`: API gateway
- `infra/mysql/init`: database-per-service schemas and seed data

## Next Priorities

- [ ] Replace mock Zustand data in both frontends with API clients that call `http://localhost:8080/api/...`.
- [ ] Standardize response shape across services, preferably `{ "items": [], "total": 0 }` for list endpoints.
- [ ] Add service-to-service order flow: order service should reserve stock through inventory service or an event.
- [ ] Move auth token handling to a shared frontend API helper.
- [ ] Add health endpoints for all services and wire them into Docker healthchecks.
- [ ] Stop tracking generated build artifacts already present in `legacy/` and service `bin/obj/.gradle` folders.

## Gateway Endpoints

| Service | Endpoint |
| --- | --- |
| Identity | `/api/auth/*` |
| Products | `/api/products` |
| Categories | `/api/categories` |
| Inventory | `/api/inventory` |
| Orders | `/api/orders` |
| Batches | `/api/batches` |

## Notes

`legacy/be_revo_coffee` is the old monolith/stub backend. Keep it as reference only; new backend work should go under `services/*`.
