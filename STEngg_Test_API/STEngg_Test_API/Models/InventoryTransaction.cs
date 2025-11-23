using System.ComponentModel.DataAnnotations;

namespace STEngg_Test_API.Models;

public enum TransactionType
{
    In = 1,
    Out = 2
}

public class InventoryTransaction
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid ProductId { get; set; }

    [Required] public TransactionType TransactionType { get; set; }

    [Required]
    [Range(1, int.MaxValue, ErrorMessage = "Quantity must be positive")]
    public int Quantity { get; set; }

    [MaxLength(500)] public string? Reason { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Product Product { get; set; } = null!;
}