using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MiraeLuxe.API.Models
{
    public class Order
    {
        [Key]
        public int OrderId { get; set; }

        [Required]
        public string UserId { get; set; }

        [ForeignKey("UserId")]
        public virtual ApplicationUser User { get; set; }

        public DateTime OrderDate { get; set; } = DateTime.Now;

        [Column(TypeName = "decimal(10,2)")]
        public decimal Subtotal { get; set; }

        [Column(TypeName = "decimal(10,2)")]
        public decimal DiscountAmount { get; set; } = 0;

        [Column(TypeName = "decimal(10,2)")]
        public decimal ShippingFee { get; set; } = 0;

        [Column(TypeName = "decimal(10,2)")]
        public decimal FinalTotal { get; set; }

        [MaxLength(50)]
        public string Status { get; set; } = "Pending";

        [Required]
        public string ShippingAddress { get; set; }

        [MaxLength(50)]
        public string PaymentMethod { get; set; }

        [MaxLength(100)]
        public string TrackingNumber { get; set; }

        public DateTime? DeliveryDate { get; set; }

        public int? FreeGiftProductId { get; set; } 

        [ForeignKey("FreeGiftProductId")]
        public virtual Product FreeGift { get; set; }

        public virtual ICollection<OrderItem> OrderItems { get; set; }
        public virtual Payment Payment { get; set; }
    }
}