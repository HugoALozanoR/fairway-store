namespace GolfTienda.Api.Application.Dtos;

public class ProductSummaryDto
{
    public int Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public string Slug { get; init; } = string.Empty;
    public decimal Price { get; init; }
    public string ImageFileName { get; init; } = string.Empty;
    public string CategorySlug { get; init; } = string.Empty;
    public string CategoryName { get; init; } = string.Empty;
    public int Stock { get; init; }
}

public class ProductDetailDto
{
    public int Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public string Slug { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
    public decimal Price { get; init; }
    public int Stock { get; init; }
    public string ImageFileName { get; init; } = string.Empty;
    public string CategorySlug { get; init; } = string.Empty;
    public string CategoryName { get; init; } = string.Empty;
}
