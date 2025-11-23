namespace STEngg_Test_API.DTOs.Requests;

public class UpdateProductRequest
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public Guid? CategoryId { get; set; }
    public bool IsActive { get; set; }
    public string? Attributes { get; set; }
    public uint? Version { get; set; } // For optimistic locking
}