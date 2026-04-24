using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace be_revo_coffee.Controllers
{
    [ApiController]
    [Route("api/admin/products")]
    [Authorize]
    public class AdminProductsController : ControllerBase
    {
        public class Product { public int Id { get; set; } public string Name { get; set; } public double Price { get; set; } }

        private static readonly List<Product> Sample = new List<Product> {
            new Product { Id = 1, Name = "Revo Dark Roast", Price = 9.99 },
            new Product { Id = 2, Name = "Revo Medium Roast", Price = 8.99 }
        };

        [HttpGet]
        public IActionResult Get() => Ok(Sample);

        [HttpPost]
        public IActionResult Create([FromBody] Product p)
        {
            p.Id = Sample.Max(x => x.Id) + 1;
            Sample.Add(p);
            return CreatedAtAction(nameof(Get), new { id = p.Id }, p);
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] Product p)
        {
            var existing = Sample.FirstOrDefault(x => x.Id == id);
            if (existing == null) return NotFound();
            existing.Name = p.Name;
            existing.Price = p.Price;
            return Ok(existing);
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var existing = Sample.FirstOrDefault(x => x.Id == id);
            if (existing == null) return NotFound();
            Sample.Remove(existing);
            return NoContent();
        }
    }
}
