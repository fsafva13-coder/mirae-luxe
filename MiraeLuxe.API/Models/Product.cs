using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MiraeLuxe.API.Models
{
    public class Product
    {
        [Key]
        public int ProductId { get; set; }

        [Required]
        [MaxLength(200)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(100)]
        public string? Brand { get; set; }  // Made nullable

        [Required]
        [MaxLength(100)]
        public string Category { get; set; } = string.Empty;

        [MaxLength(100)]
        public string? SubCategory { get; set; }  // Made nullable

        [Column(TypeName = "decimal(10,2)")]
        public decimal Price { get; set; }

        [MaxLength(50)]
        public string? Size { get; set; }  // Made nullable

        public string? Description { get; set; }  // Made nullable

        public string? KeyIngredients { get; set; }  // Made nullable

        [MaxLength(200)]
        public string? SkinType { get; set; }  // Made nullable

        public bool IsVegan { get; set; } = false;

        public bool IsCrueltyFree { get; set; } = false;

        [MaxLength(100)]
        public string? CountryOfOrigin { get; set; }  // Made nullable

        public int StockQuantity { get; set; } = 0;

        public bool IsMiniGift { get; set; } = false;

        [MaxLength(500)]
        public string? ImageUrl1 { get; set; }  // Made nullable

        [MaxLength(500)]
        public string? ImageUrl2 { get; set; }  // Made nullable

        [MaxLength(500)]
        public string? ImageUrl3 { get; set; }  // Made nullable

        public string? AvailableShades { get; set; }  // Made nullable

        public DateTime CreatedDate { get; set; } = DateTime.Now;

        [Column(TypeName = "decimal(3,2)")]
        public decimal Rating { get; set; } = 0;

        public int ReviewCount { get; set; } = 0;

        // Navigation Properties - Made nullable
        public virtual ICollection<Review>? Reviews { get; set; }
        public virtual ICollection<CartItem>? CartItems { get; set; }
        public virtual ICollection<OrderItem>? OrderItems { get; set; }
        public virtual ICollection<WishlistItem>? WishlistItems { get; set; }
    }
}