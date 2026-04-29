using Microsoft.EntityFrameworkCore;
using InventoryService.Models;

namespace InventoryService.Data
{
    public class InventoryDbContext : DbContext
    {
        public InventoryDbContext(DbContextOptions<InventoryDbContext> options) : base(options) { }

        public DbSet<InventoryItem> InventoryItems { get; set; }
        public DbSet<StockMovement> StockMovements { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<InventoryItem>(entity =>
            {
                entity.HasIndex(e => e.ProductId).IsUnique();
            });

            modelBuilder.Entity<StockMovement>(entity =>
            {
                entity.Property(e => e.MovementType)
                    .HasConversion<string>();
            });
        }
    }
}

