using System.Security.Claims;
using GolfTienda.Api.Application.Dtos;
using GolfTienda.Api.Domain;
using GolfTienda.Api.Infrastructure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GolfTienda.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    private readonly AppDbContext _db;

    public OrdersController(AppDbContext db) => _db = db;

    [HttpPost]
    [AllowAnonymous]
    public async Task<ActionResult<OrderDto>> Create([FromBody] CreateOrderRequest request)
    {
        if (!ModelState.IsValid) return ValidationProblem(ModelState);

        var consolidated = request.Items
            .GroupBy(i => i.ProductId)
            .Select(g => new { ProductId = g.Key, Quantity = g.Sum(x => x.Quantity) })
            .ToList();

        if (consolidated.Any(i => i.Quantity <= 0))
        {
            return BadRequest(new { message = "Item quantities must be positive." });
        }

        var productIds = consolidated.Select(i => i.ProductId).ToList();
        var products = await _db.Products
            .Where(p => productIds.Contains(p.Id) && p.IsActive)
            .ToDictionaryAsync(p => p.Id);

        if (products.Count != productIds.Count)
        {
            return BadRequest(new { message = "One or more products are unavailable." });
        }

        foreach (var item in consolidated)
        {
            var product = products[item.ProductId];
            if (product.Stock < item.Quantity)
            {
                return BadRequest(new
                {
                    message = $"Not enough stock for {product.Name}. Available: {product.Stock}."
                });
            }
        }

        await using var tx = await _db.Database.BeginTransactionAsync();

        var order = new Order
        {
            UserId = GetUserId(),
            CustomerName = request.CustomerName.Trim(),
            Email = request.Email.Trim(),
            ShippingAddress = request.ShippingAddress.Trim(),
            CreatedAt = DateTime.UtcNow,
            Status = OrderStatus.Paid,
        };

        decimal total = 0m;
        foreach (var item in consolidated)
        {
            var product = products[item.ProductId];
            product.Stock -= item.Quantity;

            var line = new OrderItem
            {
                ProductId = product.Id,
                UnitPrice = product.Price,
                Quantity = item.Quantity,
            };
            total += line.UnitPrice * line.Quantity;
            order.Items.Add(line);
        }
        order.Total = total;

        _db.Orders.Add(order);
        await _db.SaveChangesAsync();
        await tx.CommitAsync();

        var dto = await LoadOrderDto(order.Id);
        return CreatedAtAction(nameof(GetById), new { id = order.Id }, dto);
    }

    [HttpGet("{id:int}")]
    [AllowAnonymous]
    public async Task<ActionResult<OrderDto>> GetById(int id)
    {
        var order = await _db.Orders
            .AsNoTracking()
            .FirstOrDefaultAsync(o => o.Id == id);
        if (order is null) return NotFound();

        if (order.UserId is not null)
        {
            var userId = GetUserId();
            var isAdmin = User.IsInRole(UserRoles.Admin);
            if (!isAdmin && (userId is null || userId.Value != order.UserId.Value))
            {
                return Forbid();
            }
        }

        var dto = await LoadOrderDto(id);
        return dto is null ? NotFound() : Ok(dto);
    }

    [HttpGet("me")]
    [Authorize]
    public async Task<ActionResult<IReadOnlyList<OrderDto>>> MyOrders()
    {
        var userId = GetUserId();
        if (userId is null) return Unauthorized();

        var orders = await _db.Orders
            .Where(o => o.UserId == userId.Value)
            .OrderByDescending(o => o.CreatedAt)
            .Select(o => new OrderDto
            {
                Id = o.Id,
                CustomerName = o.CustomerName,
                Email = o.Email,
                ShippingAddress = o.ShippingAddress,
                Total = o.Total,
                Status = o.Status,
                CreatedAt = o.CreatedAt,
                Items = o.Items.Select(i => new OrderItemDto
                {
                    ProductId = i.ProductId,
                    ProductName = i.Product!.Name,
                    ProductSlug = i.Product!.Slug,
                    ImageFileName = i.Product!.ImageFileName,
                    UnitPrice = i.UnitPrice,
                    Quantity = i.Quantity,
                }).ToList(),
            })
            .ToListAsync();

        return Ok(orders);
    }

    private int? GetUserId()
    {
        var raw = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return int.TryParse(raw, out var id) ? id : null;
    }

    private async Task<OrderDto?> LoadOrderDto(int id)
    {
        return await _db.Orders
            .Where(o => o.Id == id)
            .Select(o => new OrderDto
            {
                Id = o.Id,
                CustomerName = o.CustomerName,
                Email = o.Email,
                ShippingAddress = o.ShippingAddress,
                Total = o.Total,
                Status = o.Status,
                CreatedAt = o.CreatedAt,
                Items = o.Items.Select(i => new OrderItemDto
                {
                    ProductId = i.ProductId,
                    ProductName = i.Product!.Name,
                    ProductSlug = i.Product!.Slug,
                    ImageFileName = i.Product!.ImageFileName,
                    UnitPrice = i.UnitPrice,
                    Quantity = i.Quantity,
                }).ToList(),
            })
            .FirstOrDefaultAsync();
    }
}
