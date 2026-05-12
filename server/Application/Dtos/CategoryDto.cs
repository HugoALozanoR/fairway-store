namespace GolfTienda.Api.Application.Dtos;

public class CategoryDto
{
    public int Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public string Slug { get; init; } = string.Empty;
}
