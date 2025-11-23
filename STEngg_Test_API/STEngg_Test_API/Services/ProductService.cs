using AutoMapper;
using Microsoft.EntityFrameworkCore;
using STEngg_Test_API.Data;
using STEngg_Test_API.DTOs.Requests;
using STEngg_Test_API.DTOs.Responses;
using STEngg_Test_API.Helpers;
using STEngg_Test_API.Models;
using STEngg_Test_API.Repositories.Interfaces;
using STEngg_Test_API.Services.Interfaces;

namespace STEngg_Test_API.Services;

public class ProductService : IProductService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly ICacheHelper _cacheHelper;
    private readonly ApplicationDbContext _context;
    private const string ProductCacheKeyPrefix = "product:";
    private const string ProductListCacheKeyPrefix = "products:list:";
    private const int CacheExpiryMinutes = 5;
    private const int ProductListCacheExpiryMinutes = 2;

    public ProductService(IUnitOfWork unitOfWork, IMapper mapper, ICacheHelper cacheHelper,
        ApplicationDbContext context)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _cacheHelper = cacheHelper;
        _context = context;
    }

    public async Task<ProductResponse?> GetProductByIdAsync(Guid id)
    {
        // Try cache first
        var cacheKey = $"{ProductCacheKeyPrefix}{id}";
        var cachedProduct = await _cacheHelper.GetAsync<ProductResponse>(cacheKey);
        if (cachedProduct != null)
            return cachedProduct;

        // Get from database
        var product = await _unitOfWork.Products.GetByIdWithDetailsAsync(id);
        if (product == null)
            return null;

        var response = _mapper.Map<ProductResponse>(product);

        // Cache the result
        await _cacheHelper.SetAsync(cacheKey, response, TimeSpan.FromMinutes(CacheExpiryMinutes));

        return response;
    }

    public async Task<PagedResponse<ProductResponse>> GetProductsAsync(GetProductsRequest request)
    {
        // Validate pagination
        if (request.PageNumber < 1) request.PageNumber = 1;
        if (request.PageSize < 1 || request.PageSize > 100) request.PageSize = 10;

        // Build cache key
        var cacheKey =
            $"{ProductListCacheKeyPrefix}{request.PageNumber}:{request.PageSize}:{request.SearchTerm ?? ""}:{request.CategoryId?.ToString() ?? ""}:{request.IsActive?.ToString() ?? ""}";

        // Try cache first
        var cachedResponse = await _cacheHelper.GetAsync<PagedResponse<ProductResponse>>(cacheKey);
        if (cachedResponse != null)
            return cachedResponse;

        // Get from database
        var products = await _unitOfWork.Products.GetProductsWithPaginationAsync(
            request.PageNumber,
            request.PageSize,
            request.SearchTerm,
            request.CategoryId,
            request.IsActive);

        var totalCount = await _unitOfWork.Products.GetTotalCountAsync(
            request.SearchTerm,
            request.CategoryId,
            request.IsActive);

        var productResponses = _mapper.Map<IEnumerable<ProductResponse>>(products);

        var response = new PagedResponse<ProductResponse>
        {
            Data = productResponses,
            PageNumber = request.PageNumber,
            PageSize = request.PageSize,
            TotalCount = totalCount
        };

        // Cache the result
        await _cacheHelper.SetAsync(cacheKey, response, TimeSpan.FromMinutes(ProductListCacheExpiryMinutes));

        return response;
    }

    public async Task<ProductResponse> CreateProductAsync(CreateProductRequest request)
    {
        // Check for duplicate SKU
        var existingProduct = await _unitOfWork.Products.GetBySkuAsync(request.SKU);
        if (existingProduct != null)
            throw new InvalidOperationException($"Product with SKU '{request.SKU}' already exists.");

        // Validate category exists if provided
        if (request.CategoryId.HasValue)
        {
            var category = await _unitOfWork.Categories.GetByIdAsync(request.CategoryId.Value);
            if (category == null)
                throw new InvalidOperationException($"Category with ID '{request.CategoryId}' not found.");
        }

        // Create product
        var product = _mapper.Map<Product>(request);
        product.CreatedAt = DateTime.UtcNow;
        product.UpdatedAt = DateTime.UtcNow;

        // Add images if provided
        if (request.Images != null && request.Images.Any())
        {
            foreach (var imageRequest in request.Images)
            {
                product.Images.Add(new ProductImage
                {
                    ImageUrl = imageRequest.ImageUrl,
                    IsPrimary = imageRequest.IsPrimary,
                    DisplayOrder = imageRequest.DisplayOrder
                });
            }
        }

        await _unitOfWork.Products.AddAsync(product);
        await _unitOfWork.SaveChangesAsync();

        // Invalidate cache
        await _cacheHelper.RemoveByPatternAsync($"{ProductListCacheKeyPrefix}*");

        var response = await GetProductByIdAsync(product.Id);
        return response!;
    }

    public async Task<ProductResponse> UpdateProductAsync(Guid id, UpdateProductRequest request)
    {
        var product = await _unitOfWork.Products.GetByIdAsync(id);
        if (product == null)
            throw new KeyNotFoundException($"Product with ID '{id}' not found.");

        // Optimistic locking check
        if (request.Version.HasValue && product.Version != request.Version.Value)
        {
            throw new DbUpdateConcurrencyException(
                "The product has been modified by another user. Please refresh and try again.");
        }

        // Validate category exists if provided
        if (request.CategoryId.HasValue)
        {
            var category = await _unitOfWork.Categories.GetByIdAsync(request.CategoryId.Value);
            if (category == null)
                throw new InvalidOperationException($"Category with ID '{request.CategoryId}' not found.");
        }

        // Update product
        product.Name = request.Name;
        product.Description = request.Description;
        product.Price = request.Price;
        product.CategoryId = request.CategoryId;
        product.IsActive = request.IsActive;
        product.Attributes = request.Attributes;
        product.UpdatedAt = DateTime.UtcNow;
        product.Version++; // Increment version for optimistic locking

        _unitOfWork.Products.Update(product);
        await _unitOfWork.SaveChangesAsync();

        // Invalidate cache
        await _cacheHelper.RemoveAsync($"{ProductCacheKeyPrefix}{id}");
        await _cacheHelper.RemoveByPatternAsync($"{ProductListCacheKeyPrefix}*");

        var response = await GetProductByIdAsync(id);
        return response!;
    }

    public async Task<bool> DeleteProductAsync(Guid id)
    {
        var product = await _unitOfWork.Products.GetByIdAsync(id);
        if (product == null)
            return false;

        // Soft delete
        product.IsActive = false;
        product.UpdatedAt = DateTime.UtcNow;
        product.Version++; // Increment version for optimistic locking

        _unitOfWork.Products.Update(product);
        await _unitOfWork.SaveChangesAsync();

        // Invalidate cache
        await _cacheHelper.RemoveAsync($"{ProductCacheKeyPrefix}{id}");
        await _cacheHelper.RemoveByPatternAsync($"{ProductListCacheKeyPrefix}*");

        return true;
    }

    public async Task<InventoryStatusResponse> GetInventoryStatusAsync(Guid id)
    {
        var product = await _unitOfWork.Products.GetByIdAsync(id);
        if (product == null)
            throw new KeyNotFoundException($"Product with ID '{id}' not found.");

        return new InventoryStatusResponse
        {
            ProductId = product.Id,
            ProductName = product.Name,
            SKU = product.SKU,
            CurrentStock = product.StockQuantity,
            IsLowStock = product.StockQuantity < 10
        };
    }

    public async Task<ProductResponse> AdjustInventoryAsync(Guid id, AdjustInventoryRequest request)
    {
        if (request.Quantity <= 0)
            throw new ArgumentException("Quantity must be greater than zero.");

        var product = await _unitOfWork.Products.GetByIdAsync(id);
        if (product == null)
            throw new KeyNotFoundException($"Product with ID '{id}' not found.");

        // Calculate new stock quantity
        int newStockQuantity = request.TransactionType == TransactionType.In
            ? product.StockQuantity + request.Quantity
            : product.StockQuantity - request.Quantity;

        // Prevent negative stock
        if (newStockQuantity < 0)
            throw new InvalidOperationException(
                $"Insufficient stock. Current stock: {product.StockQuantity}, Requested: {request.Quantity}");

        // Update stock
        product.StockQuantity = newStockQuantity;
        product.UpdatedAt = DateTime.UtcNow;
        product.Version++; // Increment version for optimistic locking

        // Create inventory transaction record
        var transaction = new InventoryTransaction
        {
            ProductId = id,
            TransactionType = request.TransactionType,
            Quantity = request.Quantity,
            Reason = request.Reason,
            CreatedAt = DateTime.UtcNow
        };

        // Add transaction directly to the DbSet
        await _context.InventoryTransactions.AddAsync(transaction);

        _unitOfWork.Products.Update(product);
        await _unitOfWork.SaveChangesAsync();

        // Invalidate cache
        await _cacheHelper.RemoveAsync($"{ProductCacheKeyPrefix}{id}");
        await _cacheHelper.RemoveByPatternAsync($"{ProductListCacheKeyPrefix}*");

        var response = await GetProductByIdAsync(id);
        return response!;
    }
}