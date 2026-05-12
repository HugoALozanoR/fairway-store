using Microsoft.AspNetCore.Mvc;

namespace GolfTienda.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HealthController : ControllerBase
{
    [HttpGet]
    public IActionResult Get()
    {
        return Ok(new
        {
            status = "OK",
            service = "GolfTienda.Api",
            timestamp = DateTime.UtcNow
        });
    }
}
