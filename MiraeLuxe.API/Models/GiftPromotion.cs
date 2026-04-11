using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MiraeLuxe.API.Models
{
    public class GiftPromotion
    {
        [Key]
        public int PromotionId { get; set; }

        [Required]
        [MaxLength(200)]
        public string PromotionName { get; set; }

        public string Description { get; set; }

        public bool MemberGiftEnabled { get; set; } = true;
        // Members get gift on every order

        [Column(TypeName = "decimal(10,2)")]
        public decimal NonMemberMinAmount { get; set; } = 120.00m;
        // Non-members need AED 120+ for gift

        public DateTime StartDate { get; set; }

        public DateTime? EndDate { get; set; }

        public bool IsActive { get; set; } = true;
    }
}