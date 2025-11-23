using System.ComponentModel.DataAnnotations;

namespace STEngg_Test_API.Models;

public class Product
{
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required] [MaxLength(200)] public string Name { get; set; } = string.Empty;

    [MaxLength(2000)] public string? Description { get; set; }

    [Required] [MaxLength(100)] public string SKU { get; set; } = string.Empty;

    [Required]
    [Range(0, double.MaxValue, ErrorMessage = "Price must be non-negative")]
    public decimal Price { get; set; }

    [Required]
    [Range(0, int.MaxValue, ErrorMessage = "Stock quantity must be non-negative")]
    public int StockQuantity { get; set; }

    public Guid? CategoryId { get; set; }

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public uint Version { get; set; }

    public string? Attributes { get; set; }

    public Category? Category { get; set; }
    public ICollection<ProductImage> Images { get; set; } = new List<ProductImage>();
    public ICollection<InventoryTransaction> InventoryTransactions { get; set; } = new List<InventoryTransaction>();
}