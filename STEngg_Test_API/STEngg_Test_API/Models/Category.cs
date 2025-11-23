using System.ComponentModel.DataAnnotations;

namespace STEngg_Test_API.Models;

public class Category
{
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required] [MaxLength(200)] public string Name { get; set; } = string.Empty;

    [MaxLength(1000)] public string? Description { get; set; }

    public Guid? ParentCategoryId { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Category? ParentCategory { get; set; }
    public ICollection<Category> SubCategories { get; set; } = new List<Category>();
    public ICollection<Product> Products { get; set; } = new List<Product>();
}