using STEngg_Test_API.DTOs.Requests;
using STEngg_Test_API.DTOs.Responses;

namespace STEngg_Test_API.Services.Interfaces;

public interface ICategoryService
{
    Task<IEnumerable<CategoryResponse>> GetAllCategoriesAsync();
    Task<CategoryResponse> CreateCategoryAsync(CreateCategoryRequest request);
    Task<bool> DeleteCategoryAsync(Guid id);
}