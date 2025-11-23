using FluentValidation;
using STEngg_Test_API.DTOs.Requests;

namespace STEngg_Test_API.Validators;

public class AdjustInventoryRequestValidator : AbstractValidator<AdjustInventoryRequest>
{
    public AdjustInventoryRequestValidator()
    {
        RuleFor(x => x.TransactionType)
            .IsInEnum().WithMessage("TransactionType must be either In (1) or Out (2)");

        RuleFor(x => x.Quantity)
            .GreaterThan(0).WithMessage("Quantity must be greater than zero")
            .LessThanOrEqualTo(10000).WithMessage("Quantity must not exceed 10,000");

        RuleFor(x => x.Reason)
            .MaximumLength(500).WithMessage("Reason must not exceed 500 characters")
            .When(x => !string.IsNullOrEmpty(x.Reason));
    }
}