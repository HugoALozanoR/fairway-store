using System.ComponentModel.DataAnnotations;

namespace GolfTienda.Api.Application.Dtos;

public class CreateOrderItemRequest
{
    [Range(1, int.MaxValue)]
    public int ProductId { get; set; }

    [Range(1, 50)]
    public int Quantity { get; set; }
}

public class CreateOrderRequest
{
    [Required, StringLength(160, MinimumLength = 2)]
    public string CustomerName { get; set; } = string.Empty;

    [Required, EmailAddress, StringLength(200)]
    public string Email { get; set; } = string.Empty;

    [Required, StringLength(500, MinimumLength = 5)]
    public string ShippingAddress { get; set; } = string.Empty;

    [Required, MinLength(1)]
    public List<CreateOrderItemRequest> Items { get; set; } = new();
}

public class OrderItemDto
{
    public int ProductId { get; init; }
    public string ProductName { get; init; } = string.Empty;
    public string ProductSlug { get; init; } = string.Empty;
    public string ImageFileName { get; init; } = string.Empty;
    public decimal UnitPrice { get; init; }
    public int Quantity { get; init; }
    public decimal LineTotal => UnitPrice * Quantity;
}

public class OrderDto
{
    public int Id { get; init; }
    public string CustomerName { get; init; } = string.Empty;
    public string Email { get; init; } = string.Empty;
    public string ShippingAddress { get; init; } = string.Empty;
    public decimal Total { get; init; }
    public string Status { get; init; } = string.Empty;
    public DateTime CreatedAt { get; init; }
    public List<OrderItemDto> Items { get; init; } = new();
}
