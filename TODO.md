# Microservices Migration Plan - Revo Coffee

## Architecture Overview
- **Identity Service**: PHP (PDO-based REST API) - Auth & Users
- **Product Catalog Service**: C# .NET 9 + EF Core - Products & Categories
- **Inventory Service**: C# .NET 9 + EF Core - Stock & Movements
- **Order Service**: Java Spring Boot 3 + JPA - Orders & Cart
- **Batch Service**: Java Spring Boot 3 + JPA - Coffee Batches & QC

## Infrastructure
- MySQL 8.0 (5 schemas: revo_identity, revo_products, revo_inventory, revo_orders, revo_batches)
- RabbitMQ (future: event-driven communication)
- Nginx API Gateway

## Steps

### Phase 1: Infrastructure & Database ✅
- [x] Create unified root docker-compose.yml
- [x] Create MySQL init scripts with schemas + seed data for all 5 services
- [x] Update nginx.conf for API Gateway routing

### Phase 2: PHP Identity Service ✅
- [x] Create simple PDO-based REST API (register/login/profile/users)
- [x] Update Dockerfile (php:8.2-apache)
- [x] DB connection to revo_identity

### Phase 3: C# Product Catalog Service ✅
- [x] Update connection string to revo_products
- [x] Add Category model + controller
- [x] Update Product model with Category relationship
- [x] Seed data via SQL init script

### Phase 4: C# Inventory Service (New) ✅
- [x] Create new .NET 9 project
- [x] Models: InventoryItem, StockMovement
- [x] DbContext + Controllers (Inventory, StockMovements)
- [x] Dockerfile

### Phase 5: Java Order Service ✅
- [x] Complete Spring Boot application
- [x] Entities: Order, OrderItem
- [x] Repository + Controller + Service layers
- [x] application.properties with MySQL config
- [x] Dockerfile

### Phase 6: Java Batch Service (New) ✅
- [x] Create new Spring Boot project
- [x] Entities: Batch, BatchQualityCheck
- [x] Repository + Controller + Service layers
- [x] application.properties with MySQL config
- [x] Dockerfile
- [x] Copy Gradle wrapper from orders service

### Phase 7: Integration ✅
- [x] All 5 services connected via Nginx API Gateway
- [x] Database-per-service with MySQL schemas
- [x] Seed data ready for all services

---

## How to Run

```bash
docker-compose down -v
docker-compose up --build
```

## API Endpoints (via Gateway at http://localhost:8080)

| Service | Endpoint | Description |
|---------|----------|-------------|
| Identity | `POST /api/auth/register` | User registration |
| Identity | `POST /api/auth/login` | User login + JWT |
| Identity | `GET /api/auth/profile` | Get profile (JWT) |
| Identity | `GET /api/auth/users` | List all users (Admin) |
| Products | `GET /api/products/api/products` | List products |
| Products | `GET /api/products/api/categories` | List categories |
| Inventory | `GET /api/inventory/api/inventory` | List inventory |
| Inventory | `POST /api/inventory/api/inventory/reserve` | Reserve stock |
| Orders | `GET /api/orders/api/orders` | List orders |
| Orders | `POST /api/orders/api/orders` | Create order |
| Batches | `GET /api/batches/api/batches` | List batches |
| Batches | `POST /api/batches/api/batches` | Create batch |

## Databases (phpMyAdmin at http://localhost:8081)
- `revo_identity` - Users table with 4 seed records
- `revo_products` - Products (8) + Categories (5)
- `revo_inventory` - Inventory items (8) + Stock movements (5)
- `revo_orders` - Orders (4) + Order items (7)
- `revo_batches` - Batches (5) + Quality checks (5)

