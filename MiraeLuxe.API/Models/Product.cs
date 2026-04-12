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
        public string? Brand { get; set; }  

        [Required]
        [MaxLength(100)]
        public string Category { get; set; } = string.Empty;

        [MaxLength(100)]
        public string? SubCategory { get; set; }  

        [Column(TypeName = "decimal(10,2)")]
        public decimal Price { get; set; }

        [MaxLength(50)]
        public string? Size { get; set; }  

        public string? Description { get; set; }  

        public string? KeyIngredients { get; set; }  

        [MaxLength(200)]
        public string? SkinType { get; set; }  

        public bool IsVegan { get; set; } = false;

        public bool IsCrueltyFree { get; set; } = false;

        [MaxLength(100)]
        public string? CountryOfOrigin { get; set; }  

        public int StockQuantity { get; set; } = 0;

        public bool IsMiniGift { get; set; } = false;

        [MaxLength(500)]
        public string? ImageUrl1 { get; set; }  

        [MaxLength(500)]
        public string? ImageUrl2 { get; set; }  

        [MaxLength(500)]
        public string? ImageUrl3 { get; set; }  

        public string? AvailableShades { get; set; }  

        public DateTime CreatedDate { get; set; } = DateTime.Now;

        [Column(TypeName = "decimal(3,2)")]
        public decimal Rating { get; set; } = 0;

        public int ReviewCount { get; set; } = 0;

        public virtual ICollection<Review>? Reviews { get; set; }
        public virtual ICollection<CartItem>? CartItems { get; set; }
        public virtual ICollection<OrderItem>? OrderItems { get; set; }
        public virtual ICollection<WishlistItem>? WishlistItems { get; set; }
    }
}