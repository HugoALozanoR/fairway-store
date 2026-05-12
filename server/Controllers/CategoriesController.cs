using GolfTienda.Api.Application.Dtos;
using GolfTienda.Api.Infrastructure;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GolfTienda.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly AppDbContext _db;

    public CategoriesController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<CategoryDto>>> Get()
    {
        var items = await _db.Categories
            .OrderBy(c => c.Name)
            .Select(c => new CategoryDto { Id = c.Id, Name = c.Name, Slug = c.Slug })
            .ToListAsync();

        return Ok(items);
    }
}
