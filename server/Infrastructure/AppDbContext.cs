using GolfTienda.Api.Domain;
using Microsoft.EntityFrameworkCore;

namespace GolfTienda.Api.Infrastructure;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Product> Products => Set<Product>();
    public DbSet<User> Users => Set<User>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<OrderItem> OrderItems => Set<OrderItem>();
    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();

    protected override void OnModelCreating(ModelBuilder b)
    {
        b.Entity<Category>(e =>
        {
            e.Property(c => c.Name).IsRequired().HasMaxLength(80);
            e.Property(c => c.Slug).IsRequired().HasMaxLength(80);
            e.HasIndex(c => c.Slug).IsUnique();
        });

        b.Entity<Product>(e =>
        {
            e.Property(p => p.Name).IsRequired().HasMaxLength(160);
            e.Property(p => p.Slug).IsRequired().HasMaxLength(160);
            e.Property(p => p.Description).HasMaxLength(4000);
            e.Property(p => p.ImageFileName).HasMaxLength(200);
            e.Property(p => p.Price).HasPrecision(10, 2);
            e.HasIndex(p => p.Slug).IsUnique();
            e.HasIndex(p => p.CategoryId);

            e.HasOne(p => p.Category)
                .WithMany(c => c.Products)
                .HasForeignKey(p => p.CategoryId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        b.Entity<User>(e =>
        {
            e.Property(u => u.Email).IsRequired().HasMaxLength(200);
            e.Property(u => u.FullName).HasMaxLength(160);
            e.Property(u => u.PasswordHash).IsRequired().HasMaxLength(200);
            e.Property(u => u.Role).IsRequired().HasMaxLength(20);
            e.HasIndex(u => u.Email).IsUnique();
        });

        b.Entity<Order>(e =>
        {
            e.Property(o => o.CustomerName).IsRequired().HasMaxLength(160);
            e.Property(o => o.Email).IsRequired().HasMaxLength(200);
            e.Property(o => o.ShippingAddress).IsRequired().HasMaxLength(500);
            e.Property(o => o.Status).IsRequired().HasMaxLength(20);
            e.Property(o => o.Total).HasPrecision(10, 2);

            e.HasOne(o => o.User)
                .WithMany()
                .HasForeignKey(o => o.UserId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        b.Entity<OrderItem>(e =>
        {
            e.Property(i => i.UnitPrice).HasPrecision(10, 2);

            e.HasOne(i => i.Order)
                .WithMany(o => o.Items)
                .HasForeignKey(i => i.OrderId)
                .OnDelete(DeleteBehavior.Cascade);

            e.HasOne(i => i.Product)
                .WithMany()
                .HasForeignKey(i => i.ProductId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        b.Entity<RefreshToken>(e =>
        {
            e.Property(r => r.Token).IsRequired().HasMaxLength(200);
            e.HasIndex(r => r.Token).IsUnique();
            e.HasIndex(r => r.UserId);

            e.HasOne(r => r.User)
                .WithMany()
                .HasForeignKey(r => r.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }
}
