using STEngg_Test_API.Models;

namespace STEngg_Test_API.Repositories.Interfaces;

public interface ICategoryRepository : IRepository<Category>
{
    Task<IEnumerable<Category>> GetCategoriesWithHierarchyAsync();
    Task<bool> HasProductsAsync(Guid categoryId);
}