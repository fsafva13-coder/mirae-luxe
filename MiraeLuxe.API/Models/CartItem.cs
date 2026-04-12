using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MiraeLuxe.API.Models
{
    public class CartItem
    {
        [Key]
        public int CartItemId { get; set; }

        [Required]
        public int CartId { get; set; }

        [ForeignKey("CartId")]
        public virtual Cart Cart { get; set; }

        [Required]
        public int ProductId { get; set; }

        [ForeignKey("ProductId")]
        public virtual Product Product { get; set; }

        public int Quantity { get; set; }

        [MaxLength(50)]
        public string SelectedShade { get; set; } 

        public DateTime AddedDate { get; set; } = DateTime.Now;
    }
}