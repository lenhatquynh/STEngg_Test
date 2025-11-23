using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using STEngg_Test_API.DTOs.Requests;
using STEngg_Test_API.DTOs.Responses;
using STEngg_Test_API.Services.Interfaces;

namespace STEngg_Test_API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly IProductService _productService;
    private readonly ILogger<ProductsController> _logger;

    public ProductsController(IProductService productService, ILogger<ProductsController> logger)
    {
        _productService = productService;
        _logger = logger;
    }

    [HttpGet]
    [ProducesResponseType(typeof(PagedResponse<ProductResponse>), StatusCodes.Status200OK)]
    public async Task<ActionResult<PagedResponse<ProductResponse>>> GetProducts(
        [FromQuery] GetProductsRequest request)
    {
        try
        {
            var result = await _productService.GetProductsAsync(request);
            return Ok(ApiResponse<PagedResponse<ProductResponse>>.SuccessResponse(result));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving products");
            return StatusCode(500,
                ApiResponse<PagedResponse<ProductResponse>>.ErrorResponse(
                    "An error occurred while retrieving products"));
        }
    }

    [HttpGet("{id}")]
    [ProducesResponseType(typeof(ProductResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ProductResponse>> GetProduct(Guid id)
    {
        try
        {
            var product = await _productService.GetProductByIdAsync(id);
            if (product == null)
                return NotFound(ApiResponse<ProductResponse>.ErrorResponse($"Product with ID '{id}' not found"));

            return Ok(ApiResponse<ProductResponse>.SuccessResponse(product));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving product {ProductId}", id);
            return StatusCode(500,
                ApiResponse<ProductResponse>.ErrorResponse("An error occurred while retrieving the product"));
        }
    }

    [HttpPost]
    [ProducesResponseType(typeof(ProductResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ProductResponse>> CreateProduct([FromBody] CreateProductRequest request)
    {
        try
        {
            var product = await _productService.CreateProductAsync(request);
            return CreatedAtAction(nameof(GetProduct), new { id = product.Id },
                ApiResponse<ProductResponse>.SuccessResponse(product, "Product created successfully"));
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ApiResponse<ProductResponse>.ErrorResponse(ex.Message));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating product");
            return StatusCode(500,
                ApiResponse<ProductResponse>.ErrorResponse("An error occurred while creating the product"));
        }
    }

    [HttpPut("{id}")]
    [ProducesResponseType(typeof(ProductResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<ActionResult<ProductResponse>> UpdateProduct(Guid id, [FromBody] UpdateProductRequest request)
    {
        try
        {
            var product = await _productService.UpdateProductAsync(id, request);
            return Ok(ApiResponse<ProductResponse>.SuccessResponse(product, "Product updated successfully"));
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ApiResponse<ProductResponse>.ErrorResponse(ex.Message));
        }
        catch (DbUpdateConcurrencyException)
        {
            return Conflict(ApiResponse<ProductResponse>.ErrorResponse(
                "The product has been modified by another user. Please refresh and try again."));
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ApiResponse<ProductResponse>.ErrorResponse(ex.Message));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating product {ProductId}", id);
            return StatusCode(500,
                ApiResponse<ProductResponse>.ErrorResponse("An error occurred while updating the product"));
        }
    }

    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteProduct(Guid id)
    {
        try
        {
            var deleted = await _productService.DeleteProductAsync(id);
            if (!deleted)
                return NotFound(ApiResponse<object>.ErrorResponse($"Product with ID '{id}' not found"));

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting product {ProductId}", id);
            return StatusCode(500, ApiResponse<object>.ErrorResponse("An error occurred while deleting the product"));
        }
    }

    [HttpGet("{id}/inventory")]
    [ProducesResponseType(typeof(InventoryStatusResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<InventoryStatusResponse>> GetInventoryStatus(Guid id)
    {
        try
        {
            var status = await _productService.GetInventoryStatusAsync(id);
            return Ok(ApiResponse<InventoryStatusResponse>.SuccessResponse(status));
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ApiResponse<InventoryStatusResponse>.ErrorResponse(ex.Message));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving inventory status for product {ProductId}", id);
            return StatusCode(500,
                ApiResponse<InventoryStatusResponse>.ErrorResponse(
                    "An error occurred while retrieving inventory status"));
        }
    }

    [HttpPost("{id}/inventory/adjust")]
    [ProducesResponseType(typeof(ProductResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ProductResponse>> AdjustInventory(Guid id, [FromBody] AdjustInventoryRequest request)
    {
        try
        {
            var product = await _productService.AdjustInventoryAsync(id, request);
            return Ok(ApiResponse<ProductResponse>.SuccessResponse(product, "Inventory adjusted successfully"));
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ApiResponse<ProductResponse>.ErrorResponse(ex.Message));
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ApiResponse<ProductResponse>.ErrorResponse(ex.Message));
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ApiResponse<ProductResponse>.ErrorResponse(ex.Message));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error adjusting inventory for product {ProductId}", id);
            return StatusCode(500,
                ApiResponse<ProductResponse>.ErrorResponse("An error occurred while adjusting inventory"));
        }
    }
}