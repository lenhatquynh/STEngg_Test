using System.Net;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using STEngg_Test_API.DTOs.Responses;

namespace STEngg_Test_API.Middleware;

public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            await HandleExceptionAsync(context, ex);
        }
    }

    private async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/json";
        var response = context.Response;

        var errorResponse = new ApiResponse<object>();

        switch (exception)
        {
            case KeyNotFoundException:
                response.StatusCode = (int)HttpStatusCode.NotFound;
                errorResponse = ApiResponse<object>.ErrorResponse(exception.Message);
                break;

            case ArgumentException:
            case InvalidOperationException:
                response.StatusCode = (int)HttpStatusCode.BadRequest;
                errorResponse = ApiResponse<object>.ErrorResponse(exception.Message);
                break;

            case DbUpdateConcurrencyException:
                response.StatusCode = (int)HttpStatusCode.Conflict;
                errorResponse = ApiResponse<object>.ErrorResponse(
                    "The resource has been modified by another user. Please refresh and try again.");
                break;

            case DbUpdateException:
                response.StatusCode = (int)HttpStatusCode.BadRequest;
                errorResponse =
                    ApiResponse<object>.ErrorResponse("A database error occurred. Please check your input.");
                _logger.LogError(exception, "Database update error");
                break;

            default:
                response.StatusCode = (int)HttpStatusCode.InternalServerError;
                errorResponse = ApiResponse<object>.ErrorResponse("An unexpected error occurred");
                _logger.LogError(exception, "Unhandled exception");
                break;
        }

        var options = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        };

        var jsonResponse = JsonSerializer.Serialize(errorResponse, options);
        await response.WriteAsync(jsonResponse);
    }
}