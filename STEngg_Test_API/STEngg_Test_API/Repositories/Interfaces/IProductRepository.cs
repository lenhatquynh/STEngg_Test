using STEngg_Test_API.Models;

namespace STEngg_Test_API.Repositories.Interfaces;

public interface IProductRepository : IRepository<Product>
{
    Task<Product?> GetByIdWithDetailsAsync(Guid id);
    Task<Product?> GetBySkuAsync(string sku);

    Task<IEnumerable<Product>> GetProductsWithPaginationAsync(int pageNumber, int pageSize, string? searchTerm = null,
        Guid? categoryId = null, bool? isActive = null);

    Task<int> GetTotalCountAsync(string? searchTerm = null, Guid? categoryId = null, bool? isActive = null);
}