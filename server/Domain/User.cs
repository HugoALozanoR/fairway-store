namespace GolfTienda.Api.Domain;

public static class UserRoles
{
    public const string User = "User";
    public const string Admin = "Admin";
}

public class User
{
    public int Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Role { get; set; } = UserRoles.User;
    public DateTime CreatedAt { get; set; }
}
