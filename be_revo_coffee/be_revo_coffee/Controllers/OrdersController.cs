using Microsoft.AspNetCore.Mvc;

namespace be_revo_coffee.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        public class OrderItem { public int ProductId { get; set; } public int Quantity { get; set; } }
        public class OrderReq { public string UserEmail { get; set; } public OrderItem[] Items { get; set; } }

        [HttpPost]
        public IActionResult CreateOrder([FromBody] OrderReq req)
        {
            // Sample stub - returns created order id and echo
            var result = new { orderId = 1001, created = true, order = req };
            return CreatedAtAction(nameof(GetOrders), new { id = 1001 }, result);
        }

        [HttpGet]
        public IActionResult GetOrders()
        {
            var orders = new[] {
                new { orderId = 1000, user = "test@example.com", total = 19.98, items = new[] { new { productId = 1, qty = 2 } } }
            };
            return Ok(orders);
        }
    }
}
