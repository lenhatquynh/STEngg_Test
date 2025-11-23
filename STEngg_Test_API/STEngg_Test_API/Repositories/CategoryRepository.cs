using Microsoft.EntityFrameworkCore;
using STEngg_Test_API.Data;
using STEngg_Test_API.Models;
using STEngg_Test_API.Repositories.Interfaces;

namespace STEngg_Test_API.Repositories;

public class CategoryRepository : Repository<Category>, ICategoryRepository
{
    public CategoryRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Category>> GetCategoriesWithHierarchyAsync()
    {
        return await _dbSet
            .Include(c => c.SubCategories)
            .Where(c => c.ParentCategoryId == null)
            .ToListAsync();
    }

    public async Task<bool> HasProductsAsync(Guid categoryId)
    {
        return await _context.Products
            .AnyAsync(p => p.CategoryId == categoryId);
    }
}