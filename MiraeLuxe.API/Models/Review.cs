using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace MiraeLuxe.API.Models
{
    public class Review
    {
        [Key]
        public int ReviewId { get; set; }

        [Required]
        public int ProductId { get; set; }

        [JsonIgnore]
        [ForeignKey("ProductId")]
        public virtual Product Product { get; set; }

        public string? UserId { get; set; }

        [ForeignKey("UserId")]
        public virtual ApplicationUser User { get; set; }

        [Range(1, 5)]
        public int Rating { get; set; }

        [MaxLength(200)]
        public string Title { get; set; }

        public string Comment { get; set; }

        public DateTime ReviewDate { get; set; } = DateTime.Now;

        public bool IsVerifiedPurchase { get; set; } = false;

        public int HelpfulCount { get; set; } = 0;
    }
}