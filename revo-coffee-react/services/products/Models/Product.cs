using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProductService.Models
{
    public class Product
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();

        [Required]
        [MaxLength(255)]
        public string Name { get; set; } = string.Empty;

        public string? Description { get; set; }

        [Required]
        [Column(TypeName = "decimal(10,2)")]
        public decimal Price { get; set; }

        public int? CategoryId { get; set; }

        [ForeignKey("CategoryId")]
        public Category? Category { get; set; }

        [MaxLength(50)]
        public string Type { get; set; } = string.Empty;

        [MaxLength(100)]
        public string Region { get; set; } = string.Empty;

        [MaxLength(100)]
        public string Process { get; set; } = string.Empty;

        [MaxLength(50)]
        public string Roast { get; set; } = string.Empty;

        [MaxLength(255)]
        public string FlavorNotes { get; set; } = string.Empty;

        [MaxLength(500)]
        public string Image { get; set; } = string.Empty;

        public int Stock { get; set; }

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}

