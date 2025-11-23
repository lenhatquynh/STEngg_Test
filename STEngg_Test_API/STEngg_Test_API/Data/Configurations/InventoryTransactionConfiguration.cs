using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using STEngg_Test_API.Models;

namespace STEngg_Test_API.Data.Configurations;

public class InventoryTransactionConfiguration : IEntityTypeConfiguration<InventoryTransaction>
{
    public void Configure(EntityTypeBuilder<InventoryTransaction> builder)
    {
        builder.ToTable("InventoryTransactions");

        builder.HasKey(it => it.Id);

        builder.Property(it => it.TransactionType)
            .IsRequired()
            .HasConversion<int>();

        builder.Property(it => it.Quantity)
            .IsRequired();

        builder.Property(it => it.Reason)
            .HasMaxLength(500);

        builder.Property(it => it.CreatedAt)
            .IsRequired();

        builder.HasOne(it => it.Product)
            .WithMany(p => p.InventoryTransactions)
            .HasForeignKey(it => it.ProductId)
            .OnDelete(DeleteBehavior.Cascade);

        // Index for querying transactions by product
        builder.HasIndex(it => it.ProductId);
        builder.HasIndex(it => it.CreatedAt);
    }
}

