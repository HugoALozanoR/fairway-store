using GolfTienda.Api.Application.Common;
using GolfTienda.Api.Application.Dtos;
using GolfTienda.Api.Infrastructure;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GolfTienda.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private const int MaxPageSize = 60;
    private readonly AppDbContext _db;

    public ProductsController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<ActionResult<PagedResult<ProductSummaryDto>>> Get(
        [FromQuery] string? category,
        [FromQuery] decimal? minPrice,
        [FromQuery] decimal? maxPrice,
        [FromQuery] string? search,
        [FromQuery] string? sort,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 12)
    {
        if (page < 1) page = 1;
        if (pageSize < 1) pageSize = 12;
        if (pageSize > MaxPageSize) pageSize = MaxPageSize;

        var query = _db.Products
            .Include(p => p.Category)
            .Where(p => p.IsActive)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(category))
        {
            var slug = category.Trim().ToLower();
            query = query.Where(p => p.Category!.Slug == slug);
        }

        if (minPrice.HasValue) query = query.Where(p => p.Price >= minPrice.Value);
        if (maxPrice.HasValue) query = query.Where(p => p.Price <= maxPrice.Value);

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim().ToLower();
            query = query.Where(p =>
                p.Name.ToLower().Contains(term) ||
                p.Description.ToLower().Contains(term));
        }

        query = sort switch
        {
            "price_asc" => query.OrderBy(p => p.Price),
            "price_desc" => query.OrderByDescending(p => p.Price),
            "name_asc" => query.OrderBy(p => p.Name),
            _ => query.OrderByDescending(p => p.CreatedAt).ThenByDescending(p => p.Id),
        };

        var total = await query.CountAsync();

        var items = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(p => new ProductSummaryDto
            {
                Id = p.Id,
                Name = p.Name,
                Slug = p.Slug,
                Price = p.Price,
                ImageFileName = p.ImageFileName,
                CategorySlug = p.Category!.Slug,
                CategoryName = p.Category.Name,
                Stock = p.Stock,
            })
            .ToListAsync();

        return Ok(new PagedResult<ProductSummaryDto>
        {
            Items = items,
            Total = total,
            Page = page,
            PageSize = pageSize,
        });
    }

    [HttpGet("{slug}")]
    public async Task<ActionResult<ProductDetailDto>> GetBySlug(string slug)
    {
        var product = await _db.Products
            .Include(p => p.Category)
            .Where(p => p.IsActive && p.Slug == slug)
            .Select(p => new ProductDetailDto
            {
                Id = p.Id,
                Name = p.Name,
                Slug = p.Slug,
                Description = p.Description,
                Price = p.Price,
                Stock = p.Stock,
                ImageFileName = p.ImageFileName,
                CategorySlug = p.Category!.Slug,
                CategoryName = p.Category.Name,
            })
            .FirstOrDefaultAsync();

        return product is null ? NotFound() : Ok(product);
    }
}
