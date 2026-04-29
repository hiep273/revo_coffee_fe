using Microsoft.AspNetCore.Mvc;

namespace be_revo_coffee.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            var items = new[] {
                new { id = 1, name = "Revo Dark Roast", price = 9.99, description = "Rich dark roast" },
                new { id = 2, name = "Revo Medium Roast", price = 8.99, description = "Balanced and smooth" }
            };
            return Ok(items);
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var item = new { id = id, name = $"Revo Coffee #{id}", price = 9.49, description = "Sample product" };
            return Ok(item);
        }
    }
}
