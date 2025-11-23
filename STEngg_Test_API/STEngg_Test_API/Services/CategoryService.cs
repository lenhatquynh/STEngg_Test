using AutoMapper;
using STEngg_Test_API.DTOs.Requests;
using STEngg_Test_API.DTOs.Responses;
using STEngg_Test_API.Models;
using STEngg_Test_API.Repositories.Interfaces;
using STEngg_Test_API.Services.Interfaces;

namespace STEngg_Test_API.Services;

public class CategoryService : ICategoryService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public CategoryService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<IEnumerable<CategoryResponse>> GetAllCategoriesAsync()
    {
        var categories = await _unitOfWork.Categories.GetCategoriesWithHierarchyAsync();
        return _mapper.Map<IEnumerable<CategoryResponse>>(categories);
    }

    public async Task<CategoryResponse> CreateCategoryAsync(CreateCategoryRequest request)
    {
        if (request.ParentCategoryId.HasValue)
        {
            var parentCategory = await _unitOfWork.Categories.GetByIdAsync(request.ParentCategoryId.Value);
            if (parentCategory == null)
                throw new InvalidOperationException($"Parent category with ID '{request.ParentCategoryId}' not found.");
        }

        var category = _mapper.Map<Category>(request);
        category.CreatedAt = DateTime.UtcNow;

        await _unitOfWork.Categories.AddAsync(category);
        await _unitOfWork.SaveChangesAsync();

        var response = _mapper.Map<CategoryResponse>(category);
        if (request.ParentCategoryId.HasValue)
        {
            var parent = await _unitOfWork.Categories.GetByIdAsync(request.ParentCategoryId.Value);
            response.ParentCategoryName = parent?.Name;
        }

        return response;
    }

    public async Task<bool> DeleteCategoryAsync(Guid id)
    {
        var category = await _unitOfWork.Categories.GetByIdAsync(id);
        if (category == null)
            return false;

        var hasProducts = await _unitOfWork.Categories.HasProductsAsync(id);
        if (hasProducts)
            throw new InvalidOperationException("Cannot delete category that has associated products.");

        var hasSubCategories = category.SubCategories.Any();
        if (hasSubCategories)
            throw new InvalidOperationException("Cannot delete category that has subcategories.");

        _unitOfWork.Categories.Delete(category);
        await _unitOfWork.SaveChangesAsync();

        return true;
    }
}