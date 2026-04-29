using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace be_revo_coffee.Controllers
{
    [ApiController]
    [Route("api/admin/inventory")]
    [Authorize]
    public class InventoryController : ControllerBase
    {
        public class InventoryItem { public int ProductId { get; set; } public int Quantity { get; set; } }

        private static readonly List<InventoryItem> Stock = new List<InventoryItem> {
            new InventoryItem { ProductId = 1, Quantity = 50 },
            new InventoryItem { ProductId = 2, Quantity = 30 }
        };

        [HttpGet]
        public IActionResult Get() => Ok(Stock);

        [HttpPut("{productId}")]
        public IActionResult Update(int productId, [FromBody] InventoryItem item)
        {
            var existing = Stock.FirstOrDefault(s => s.ProductId == productId);
            if (existing == null)
            {
                Stock.Add(item);
                return CreatedAtAction(nameof(Get), new { productId = item.ProductId }, item);
            }
            existing.Quantity = item.Quantity;
            return Ok(existing);
        }
    }
}
