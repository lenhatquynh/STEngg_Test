using System.ComponentModel.DataAnnotations;

namespace STEngg_Test_API.Models;

public class ProductImage
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid ProductId { get; set; }

    [Required] [MaxLength(500)] public string ImageUrl { get; set; } = string.Empty;

    public bool IsPrimary { get; set; } = false;

    public int DisplayOrder { get; set; } = 0;

    public Product Product { get; set; } = null!;
}