namespace GolfTienda.Api.Domain;

public static class OrderStatus
{
    public const string Pending = "Pending";
    public const string Paid = "Paid";
    public const string Shipped = "Shipped";
    public const string Cancelled = "Cancelled";
}

public class Order
{
    public int Id { get; set; }
    public int? UserId { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string ShippingAddress { get; set; } = string.Empty;
    public decimal Total { get; set; }
    public string Status { get; set; } = OrderStatus.Pending;
    public DateTime CreatedAt { get; set; }

    public User? User { get; set; }
    public ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();
}
