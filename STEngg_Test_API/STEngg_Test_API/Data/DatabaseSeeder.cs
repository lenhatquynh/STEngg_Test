using Microsoft.EntityFrameworkCore;
using STEngg_Test_API.Models;

namespace STEngg_Test_API.Data;

public class DatabaseSeeder
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<DatabaseSeeder> _logger;

    public DatabaseSeeder(ApplicationDbContext context, ILogger<DatabaseSeeder> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task SeedAsync()
    {
        try
        {
            var hasExistingData = await _context.Categories.AnyAsync() ||
                                  await _context.Products.AnyAsync();

            if (hasExistingData)
            {
                _logger.LogInformation("Database already contains data. Skipping seed data initialization.");
                return;
            }

            _logger.LogInformation("Database is empty. Starting initial seed data...");

            var categories = await SeedCategoriesAsync();

            await SeedProductsAsync(categories);

            _logger.LogInformation("Database seeding completed successfully.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while seeding the database.");
            throw;
        }
    }

    private async Task<List<Category>> SeedCategoriesAsync()
    {
        var categories = new List<Category>
        {
            new Category
            {
                Id = Guid.NewGuid(),
                Name = "Men's Fashion",
                Description = "Men's clothing and accessories",
                CreatedAt = DateTime.UtcNow
            },
            new Category
            {
                Id = Guid.NewGuid(),
                Name = "Women's Fashion",
                Description = "Women's clothing and accessories",
                CreatedAt = DateTime.UtcNow
            },
            new Category
            {
                Id = Guid.NewGuid(),
                Name = "Accessories",
                Description = "Fashion accessories for all",
                CreatedAt = DateTime.UtcNow
            },
            new Category
            {
                Id = Guid.NewGuid(),
                Name = "Footwear",
                Description = "Shoes and boots",
                CreatedAt = DateTime.UtcNow
            }
        };

        var mensCategory = categories[0];
        var womensCategory = categories[1];

        var subCategories = new List<Category>
        {
            new Category
            {
                Id = Guid.NewGuid(),
                Name = "Shirts",
                Description = "Men's shirts",
                ParentCategoryId = mensCategory.Id,
                CreatedAt = DateTime.UtcNow
            },
            new Category
            {
                Id = Guid.NewGuid(),
                Name = "Pants",
                Description = "Men's pants",
                ParentCategoryId = mensCategory.Id,
                CreatedAt = DateTime.UtcNow
            },
            new Category
            {
                Id = Guid.NewGuid(),
                Name = "Dresses",
                Description = "Women's dresses",
                ParentCategoryId = womensCategory.Id,
                CreatedAt = DateTime.UtcNow
            }
        };

        categories.AddRange(subCategories);

        await _context.Categories.AddRangeAsync(categories);
        await _context.SaveChangesAsync();

        _logger.LogInformation($"Seeded {categories.Count} categories.");

        return categories;
    }

    private async Task SeedProductsAsync(List<Category> categories)
    {
        var mensCategory = categories.First(c => c.Name == "Men's Fashion");
        var womensCategory = categories.First(c => c.Name == "Women's Fashion");
        var accessoriesCategory = categories.First(c => c.Name == "Accessories");
        var footwearCategory = categories.First(c => c.Name == "Footwear");
        var shirtsCategory = categories.First(c => c.Name == "Shirts");
        var dressesCategory = categories.First(c => c.Name == "Dresses");

        var products = new List<Product>
        {
            // Men's Products
            new Product
            {
                Id = Guid.NewGuid(),
                Name = "Classic White Dress Shirt",
                Description =
                    "Premium cotton dress shirt with button-down collar. Perfect for business or formal occasions.",
                SKU = "M-SHIRT-001",
                Price = 49.99m,
                StockQuantity = 150,
                CategoryId = shirtsCategory.Id,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                Attributes =
                    "{\"Size\":[\"S\",\"M\",\"L\",\"XL\"],\"Color\":\"White\",\"Material\":\"100% Cotton\",\"Fit\":\"Regular\"}",
                Images = new List<ProductImage>
                {
                    new ProductImage
                    {
                        Id = Guid.NewGuid(),
                        ImageUrl = "https://images.unsplash.com/photo-1594938291221-94ad3b39d788?w=500",
                        IsPrimary = true,
                        DisplayOrder = 1
                    }
                }
            },
            new Product
            {
                Id = Guid.NewGuid(),
                Name = "Slim Fit Chino Pants",
                Description =
                    "Comfortable and stylish chino pants with modern slim fit. Great for casual and smart casual wear.",
                SKU = "M-PANT-001",
                Price = 59.99m,
                StockQuantity = 200,
                CategoryId = categories.First(c => c.Name == "Pants").Id,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                Attributes =
                    "{\"Size\":[\"30\",\"32\",\"34\",\"36\"],\"Color\":\"Khaki\",\"Material\":\"98% Cotton, 2% Elastane\"}",
                Images = new List<ProductImage>
                {
                    new ProductImage
                    {
                        Id = Guid.NewGuid(),
                        ImageUrl = "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500",
                        IsPrimary = true,
                        DisplayOrder = 1
                    }
                }
            },
            new Product
            {
                Id = Guid.NewGuid(),
                Name = "Leather Dress Shoes",
                Description = "Handcrafted leather dress shoes with classic design. Perfect for formal occasions.",
                SKU = "M-SHOE-001",
                Price = 129.99m,
                StockQuantity = 75,
                CategoryId = footwearCategory.Id,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                Attributes =
                    "{\"Size\":[\"7\",\"8\",\"9\",\"10\",\"11\"],\"Color\":\"Black\",\"Material\":\"Genuine Leather\"}",
                Images = new List<ProductImage>
                {
                    new ProductImage
                    {
                        Id = Guid.NewGuid(),
                        ImageUrl = "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500",
                        IsPrimary = true,
                        DisplayOrder = 1
                    }
                }
            },

            // Women's Products
            new Product
            {
                Id = Guid.NewGuid(),
                Name = "Floral Summer Dress",
                Description =
                    "Beautiful floral print summer dress with flowing fabric. Perfect for warm weather occasions.",
                SKU = "W-DRESS-001",
                Price = 79.99m,
                StockQuantity = 120,
                CategoryId = dressesCategory.Id,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                Attributes =
                    "{\"Size\":[\"XS\",\"S\",\"M\",\"L\",\"XL\"],\"Color\":\"Floral Print\",\"Material\":\"100% Polyester\",\"Style\":\"A-Line\"}",
                Images = new List<ProductImage>
                {
                    new ProductImage
                    {
                        Id = Guid.NewGuid(),
                        ImageUrl = "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500",
                        IsPrimary = true,
                        DisplayOrder = 1
                    },
                    new ProductImage
                    {
                        Id = Guid.NewGuid(),
                        ImageUrl = "https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=500",
                        IsPrimary = false,
                        DisplayOrder = 2
                    }
                }
            },
            new Product
            {
                Id = Guid.NewGuid(),
                Name = "Designer Handbag",
                Description =
                    "Elegant designer handbag with premium leather. Spacious interior with multiple compartments.",
                SKU = "W-BAG-001",
                Price = 199.99m,
                StockQuantity = 50,
                CategoryId = accessoriesCategory.Id,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                Attributes =
                    "{\"Color\":[\"Black\",\"Brown\",\"Navy\"],\"Material\":\"Genuine Leather\",\"Dimensions\":\"12x10x5 inches\"}",
                Images = new List<ProductImage>
                {
                    new ProductImage
                    {
                        Id = Guid.NewGuid(),
                        ImageUrl = "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
                        IsPrimary = true,
                        DisplayOrder = 1
                    }
                }
            },
            new Product
            {
                Id = Guid.NewGuid(),
                Name = "High Heel Sandals",
                Description = "Stylish high heel sandals with comfortable padding. Perfect for evening events.",
                SKU = "W-SHOE-001",
                Price = 89.99m,
                StockQuantity = 80,
                CategoryId = footwearCategory.Id,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                Attributes =
                    "{\"Size\":[\"6\",\"7\",\"8\",\"9\",\"10\"],\"Color\":[\"Black\",\"Nude\",\"Red\"],\"Heel Height\":\"3.5 inches\"}",
                Images = new List<ProductImage>
                {
                    new ProductImage
                    {
                        Id = Guid.NewGuid(),
                        ImageUrl = "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500",
                        IsPrimary = true,
                        DisplayOrder = 1
                    }
                }
            },

            // Accessories
            new Product
            {
                Id = Guid.NewGuid(),
                Name = "Leather Belt",
                Description = "Classic leather belt with silver buckle. Adjustable sizing for perfect fit.",
                SKU = "ACC-BELT-001",
                Price = 34.99m,
                StockQuantity = 100,
                CategoryId = accessoriesCategory.Id,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                Attributes =
                    "{\"Size\":[\"S\",\"M\",\"L\",\"XL\"],\"Color\":[\"Black\",\"Brown\"],\"Material\":\"Genuine Leather\"}",
                Images = new List<ProductImage>
                {
                    new ProductImage
                    {
                        Id = Guid.NewGuid(),
                        ImageUrl = "https://images.unsplash.com/photo-1624222247344-550fb60583fd?w=500",
                        IsPrimary = true,
                        DisplayOrder = 1
                    }
                }
            },
            new Product
            {
                Id = Guid.NewGuid(),
                Name = "Sunglasses",
                Description = "UV protection sunglasses with polarized lenses. Stylish frame design.",
                SKU = "ACC-SUN-001",
                Price = 49.99m,
                StockQuantity = 90,
                CategoryId = accessoriesCategory.Id,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                Attributes =
                    "{\"Frame Color\":[\"Black\",\"Brown\",\"Tortoise\"],\"Lens Type\":\"Polarized\",\"UV Protection\":\"100%\"}",
                Images = new List<ProductImage>
                {
                    new ProductImage
                    {
                        Id = Guid.NewGuid(),
                        ImageUrl = "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500",
                        IsPrimary = true,
                        DisplayOrder = 1
                    }
                }
            },

            // Low stock item
            new Product
            {
                Id = Guid.NewGuid(),
                Name = "Limited Edition Watch",
                Description = "Premium limited edition watch with leather strap. Only a few left in stock!",
                SKU = "ACC-WATCH-001",
                Price = 299.99m,
                StockQuantity = 5,
                CategoryId = accessoriesCategory.Id,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                Attributes = "{\"Color\":\"Black\",\"Material\":\"Leather Strap\",\"Water Resistance\":\"50m\"}",
                Images = new List<ProductImage>
                {
                    new ProductImage
                    {
                        Id = Guid.NewGuid(),
                        ImageUrl = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
                        IsPrimary = true,
                        DisplayOrder = 1
                    }
                }
            },

            // Inactive product
            new Product
            {
                Id = Guid.NewGuid(),
                Name = "Discontinued Item",
                Description = "This item is no longer available.",
                SKU = "DISCONT-001",
                Price = 29.99m,
                StockQuantity = 0,
                CategoryId = accessoriesCategory.Id,
                IsActive = false,
                CreatedAt = DateTime.UtcNow.AddDays(-30),
                UpdatedAt = DateTime.UtcNow.AddDays(-10),
                Attributes = "{\"Status\":\"Discontinued\"}",
                Images = new List<ProductImage>()
            }
        };

        foreach (var product in products)
        {
            product.Version = 0;
        }

        await _context.Products.AddRangeAsync(products);
        await _context.SaveChangesAsync();

        var transactions = new List<InventoryTransaction>
        {
            new InventoryTransaction
            {
                Id = Guid.NewGuid(),
                ProductId = products[0].Id,
                TransactionType = TransactionType.In,
                Quantity = 150,
                Reason = "Initial stock",
                CreatedAt = DateTime.UtcNow.AddDays(-10)
            },
            new InventoryTransaction
            {
                Id = Guid.NewGuid(),
                ProductId = products[3].Id,
                TransactionType = TransactionType.Out,
                Quantity = 30,
                Reason = "Sales",
                CreatedAt = DateTime.UtcNow.AddDays(-5)
            },
            new InventoryTransaction
            {
                Id = Guid.NewGuid(),
                ProductId = products[8].Id,
                TransactionType = TransactionType.Out,
                Quantity = 15,
                Reason = "Sales",
                CreatedAt = DateTime.UtcNow.AddDays(-3)
            }
        };

        await _context.InventoryTransactions.AddRangeAsync(transactions);
        await _context.SaveChangesAsync();

        _logger.LogInformation($"Seeded {products.Count} products and {transactions.Count} inventory transactions.");
    }
}