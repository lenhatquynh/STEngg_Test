using STEngg_Test_API.Models;

namespace STEngg_Test_API.DTOs.Requests;

public class AdjustInventoryRequest
{
    public TransactionType TransactionType { get; set; }
    public int Quantity { get; set; }
    public string? Reason { get; set; }
}