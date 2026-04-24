using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace be_revo_coffee.Controllers
{
    [ApiController]
    [Route("api/admin/batches")]
    [Authorize]
    public class BatchesController : ControllerBase
    {
        public class Batch { public int Id { get; set; } public int ProductId { get; set; } public int Quantity { get; set; } public string Notes { get; set; } }

        private static readonly List<Batch> Batches = new List<Batch> {
            new Batch { Id = 1, ProductId = 1, Quantity = 100, Notes = "Initial roast batch" }
        };

        [HttpGet]
        public IActionResult Get() => Ok(Batches);

        [HttpPost]
        public IActionResult Create([FromBody] Batch b)
        {
            b.Id = Batches.Max(x => x.Id) + 1;
            Batches.Add(b);
            return CreatedAtAction(nameof(Get), new { id = b.Id }, b);
        }
    }
}
