# Product Management API - Interview Assessment

A scalable product management system for retail/e-commerce applications built with .NET 6, PostgreSQL, and Redis.

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose installed
- (Optional) .NET 6 SDK for local development

### Running the Application

1. **Start all services with Docker Compose:**
   ```bash
   docker-compose up -d
   ```

2. **Wait for services to be ready** (about 30-60 seconds)

3. **Access the API:**
   - **Swagger UI**: http://localhost:8080/swagger
   - **API Base URL**: http://localhost:8080/api

4. **Access the UI** (if needed):
   - **Frontend**: http://localhost:3000

### What Happens on Startup

- ✅ Database migrations are automatically applied
- ✅ Sample data is automatically seeded (products, categories, inventory transactions)
- ✅ Redis cache is initialized

## 📊 Sample Data

The database is pre-seeded with:

- **4 Main Categories**: Men's Fashion, Women's Fashion, Accessories, Footwear
- **3 Subcategories**: Shirts, Pants, Dresses
- **9 Sample Products** including:
  - Classic White Dress Shirt
  - Slim Fit Chino Pants
  - Leather Dress Shoes
  - Floral Summer Dress
  - Designer Handbag
  - High Heel Sandals
  - Leather Belt
  - Sunglasses
  - Limited Edition Watch (low stock - 5 items)
  - Discontinued Item (inactive)

- **Inventory Transactions** for testing inventory management

## 🔌 API Endpoints

### Products

- `GET /api/products` - List products (with pagination, filtering, sorting)
  - Query params: `pageNumber`, `pageSize`, `searchTerm`, `categoryId`, `isActive`
- `GET /api/products/{id}` - Get product by ID
- `POST /api/products` - Create product
- `PUT /api/products/{id}` - Update product (with optimistic locking)
- `DELETE /api/products/{id}` - Soft delete product
- `GET /api/products/{id}/inventory` - Get inventory status
- `POST /api/products/{id}/inventory/adjust` - Adjust inventory (stock in/out)

### Categories

- `GET /api/categories` - List all categories with hierarchy
- `POST /api/categories` - Create category
- `DELETE /api/categories/{id}` - Delete category

## 🧪 Testing the API

### Example: Get All Products
```bash
curl http://localhost:8080/api/products?pageNumber=1&pageSize=10
```

### Example: Get Product by ID
```bash
curl http://localhost:8080/api/products/{product-id}
```

### Example: Create a Product
```bash
curl -X POST http://localhost:8080/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Product",
    "sku": "NEW-PROD-001",
    "price": 99.99,
    "stockQuantity": 50,
    "description": "A new product"
  }'
```

## 🏗️ Architecture

### Technology Stack
- **Backend**: .NET 6 (C#)
- **Database**: PostgreSQL 15
- **Cache**: Redis 7
- **ORM**: Entity Framework Core 6
- **Validation**: FluentValidation
- **Mapping**: AutoMapper

### Design Patterns
- **Repository Pattern** - Data access abstraction
- **Unit of Work Pattern** - Transaction management
- **Service Layer** - Business logic separation
- **DTO Pattern** - API contract separation
- **Cache-Aside Pattern** - Redis caching strategy

### Key Features
- ✅ Strong consistency with Unit of Work
- ✅ Optimistic locking for concurrency control
- ✅ Redis caching with automatic invalidation
- ✅ Input validation with FluentValidation
- ✅ Comprehensive error handling
- ✅ Pagination and filtering
- ✅ Soft delete for products
- ✅ Inventory transaction tracking
- ✅ Edge case handling

## 📁 Project Structure

```
STEngg_Test_API/
├── Controllers/          # API endpoints
├── Services/             # Business logic
├── Repositories/         # Data access
├── Data/                 # DbContext & configurations
├── Models/               # Domain entities
├── DTOs/                 # Request/Response models
├── Validators/           # FluentValidation rules
├── Mappings/             # AutoMapper profiles
├── Middleware/           # Exception handling
└── Helpers/              # Utilities (Cache, etc.)
```

## 🔧 Environment Variables

The application uses the following connection strings (configured in docker-compose.yml):

- **PostgreSQL**: `Host=postgres;Port=5432;Database=stengg_db;Username=stengg_user;Password=stengg_password`
- **Redis**: `redis:6379`

## 🛑 Stopping the Application

```bash
docker-compose down
```

To also remove volumes (⚠️ this will delete all data):
```bash
docker-compose down -v
```

## 📝 Notes

- The database is automatically migrated on startup
- Sample data is seeded only if the database is empty
- Redis cache improves performance for frequently accessed data
- All API responses follow a consistent format with `ApiResponse<T>`
- Optimistic locking prevents concurrent update conflicts

## 🐛 Troubleshooting

### Database connection issues
- Ensure Docker containers are running: `docker-compose ps`
- Check logs: `docker-compose logs postgres`

### Redis connection issues
- Check Redis container: `docker-compose logs redis`
- Verify Redis is healthy: `docker-compose ps redis`

### Migration issues
- Migrations run automatically on startup
- If needed, you can manually run: `dotnet ef database update` (requires .NET SDK)

