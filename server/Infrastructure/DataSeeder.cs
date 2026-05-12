using GolfTienda.Api.Domain;
using Microsoft.EntityFrameworkCore;

namespace GolfTienda.Api.Infrastructure;

public static class DataSeeder
{
    private static readonly DateTime SeedTime = new(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc);

    public static async Task SeedAsync(AppDbContext db)
    {
        await db.Database.MigrateAsync();

        await SeedCategoriesAsync(db);
        await SeedProductsAsync(db);
        await SeedAdminAsync(db);
    }

    private static async Task SeedCategoriesAsync(AppDbContext db)
    {
        if (await db.Categories.AnyAsync()) return;

        db.Categories.AddRange(
            new Category { Name = "Clubs", Slug = "clubs" },
            new Category { Name = "Balls", Slug = "balls" },
            new Category { Name = "Gloves", Slug = "gloves" },
            new Category { Name = "Bags", Slug = "bags" },
            new Category { Name = "Shoes", Slug = "shoes" },
            new Category { Name = "Apparel", Slug = "apparel" },
            new Category { Name = "Accessories", Slug = "accessories" }
        );

        await db.SaveChangesAsync();
    }

    private static async Task SeedProductsAsync(AppDbContext db)
    {
        if (await db.Products.AnyAsync()) return;

        var bySlug = await db.Categories.ToDictionaryAsync(c => c.Slug, c => c.Id);

        var products = new List<Product>
        {
            // Clubs
            New("Titan Pro Driver", "titan-pro-driver",
                "Tour-grade titanium driver engineered for distance and forgiveness off the tee.",
                499.00m, 12, "titan-pro-driver.jpg", bySlug["clubs"]),
            New("Heritage Blade Iron Set", "heritage-blade-iron-set",
                "Forged carbon-steel blades for the precision-minded golfer. 4-PW.",
                1199.00m, 6, "heritage-blade-iron-set.jpg", bySlug["clubs"]),
            New("Crescent Putter 33\"", "crescent-putter-33",
                "Milled mallet putter with a soft insert for a smooth, confident roll.",
                249.00m, 18, "crescent-putter.jpg", bySlug["clubs"]),
            New("Fairway Hybrid 3", "fairway-hybrid-3",
                "Versatile 3-hybrid that launches high and lands soft from any lie.",
                179.00m, 22, "fairway-hybrid-3.jpg", bySlug["clubs"]),

            // Balls
            New("Tour Spin X Dozen", "tour-spin-x-dozen",
                "Four-piece urethane balls with low driver spin and high greenside control.",
                54.00m, 80, "tour-spin-x.jpg", bySlug["balls"]),
            New("Soft Feel Pearl Dozen", "soft-feel-pearl-dozen",
                "Low compression, soft-feel ball for everyday play and slower swing speeds.",
                32.00m, 120, "soft-feel-pearl.jpg", bySlug["balls"]),
            New("Distance Max Yellow Dozen", "distance-max-yellow-dozen",
                "High visibility yellow balls built for maximum distance off the tee.",
                28.00m, 95, "distance-max-yellow.jpg", bySlug["balls"]),

            // Gloves
            New("Cabretta Tour Glove", "cabretta-tour-glove",
                "Premium cabretta leather glove with a thin, tour-preferred feel.",
                28.00m, 60, "cabretta-tour-glove.jpg", bySlug["gloves"]),
            New("All-Weather Grip Glove", "all-weather-grip-glove",
                "Synthetic glove that maintains grip in rain or shine.",
                19.00m, 75, "all-weather-glove.jpg", bySlug["gloves"]),

            // Bags
            New("Carbon Stand Bag", "carbon-stand-bag",
                "Lightweight carbon-fiber stand bag with a 14-way top and dual-strap harness.",
                329.00m, 14, "carbon-stand-bag.jpg", bySlug["bags"]),
            New("Cart Bag Elite", "cart-bag-elite",
                "Spacious 15-way cart bag with magnetic pockets and a cooler sleeve.",
                269.00m, 9, "cart-bag-elite.jpg", bySlug["bags"]),

            // Shoes
            New("Greens Spikeless Shoe", "greens-spikeless-shoe",
                "Waterproof spikeless shoe with a cushioned midsole for all-day comfort.",
                159.00m, 30, "greens-spikeless.jpg", bySlug["shoes"]),
            New("Tour Spike Shoe", "tour-spike-shoe",
                "Classic spiked shoe with a stable platform and premium leather upper.",
                189.00m, 20, "tour-spike-shoe.jpg", bySlug["shoes"]),

            // Apparel
            New("Performance Polo", "performance-polo",
                "Moisture-wicking polo with four-way stretch and UPF 50 protection.",
                79.00m, 50, "performance-polo.jpg", bySlug["apparel"]),
            New("Tailored Golf Trousers", "tailored-golf-trousers",
                "Slim-fit golf trousers in a soft, breathable technical weave.",
                119.00m, 35, "tailored-trousers.jpg", bySlug["apparel"]),
            New("Quarter-Zip Pullover", "quarter-zip-pullover",
                "Lightweight, wind-resistant pullover for cool mornings on the course.",
                99.00m, 28, "quarter-zip-pullover.jpg", bySlug["apparel"]),
            New("Tour Cap Charcoal", "tour-cap-charcoal",
                "Structured performance cap with a hidden sweatband.",
                34.00m, 70, "tour-cap-charcoal.jpg", bySlug["apparel"]),

            // Accessories
            New("Leather Headcover Set", "leather-headcover-set",
                "Hand-stitched leather headcovers for driver, fairway, and hybrid.",
                149.00m, 16, "leather-headcover-set.jpg", bySlug["accessories"]),
            New("Magnetic Ball Marker", "magnetic-ball-marker",
                "Brushed metal ball marker with a magnetic hat clip.",
                14.00m, 200, "magnetic-ball-marker.jpg", bySlug["accessories"]),
            New("Range Finder Pro", "range-finder-pro",
                "6x magnification laser rangefinder with slope mode and flag lock.",
                349.00m, 11, "range-finder-pro.jpg", bySlug["accessories"]),
            New("Divot Repair Tool", "divot-repair-tool",
                "Stainless divot tool with a removable magnetic marker.",
                12.00m, 4, "divot-repair-tool.jpg", bySlug["accessories"])
        };

        db.Products.AddRange(products);
        await db.SaveChangesAsync();
    }

    private static async Task SeedAdminAsync(AppDbContext db)
    {
        const string adminEmail = "admin@golftienda.com";
        if (await db.Users.AnyAsync(u => u.Email == adminEmail)) return;

        db.Users.Add(new User
        {
            Email = adminEmail,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin123!"),
            FullName = "Store Admin",
            Role = UserRoles.Admin,
            CreatedAt = SeedTime
        });

        await db.SaveChangesAsync();
    }

    private static Product New(string name, string slug, string description,
        decimal price, int stock, string image, int categoryId) => new()
        {
            Name = name,
            Slug = slug,
            Description = description,
            Price = price,
            Stock = stock,
            ImageFileName = image,
            CategoryId = categoryId,
            IsActive = true,
            CreatedAt = SeedTime
        };
}
