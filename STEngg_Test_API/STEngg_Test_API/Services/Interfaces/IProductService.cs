using STEngg_Test_API.DTOs.Requests;
using STEngg_Test_API.DTOs.Responses;

namespace STEngg_Test_API.Services.Interfaces;

public interface IProductService
{
    Task<ProductResponse?> GetProductByIdAsync(Guid id);
    Task<PagedResponse<ProductResponse>> GetProductsAsync(GetProductsRequest request);
    Task<ProductResponse> CreateProductAsync(CreateProductRequest request);
    Task<ProductResponse> UpdateProductAsync(Guid id, UpdateProductRequest request);
    Task<bool> DeleteProductAsync(Guid id);
    Task<InventoryStatusResponse> GetInventoryStatusAsync(Guid id);
    Task<ProductResponse> AdjustInventoryAsync(Guid id, AdjustInventoryRequest request);
}