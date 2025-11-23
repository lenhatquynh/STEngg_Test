namespace STEngg_Test_API.DTOs.Responses;

public class InventoryStatusResponse
{
    public Guid ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public string SKU { get; set; } = string.Empty;
    public int CurrentStock { get; set; }
    public bool IsLowStock { get; set; }
    public int LowStockThreshold { get; set; } = 10; // Default threshold
}