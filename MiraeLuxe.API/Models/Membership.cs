using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MiraeLuxe.API.Models
{
    public class Membership
    {
        [Key]
        public int MembershipId { get; set; }

        [Required]
        public string UserId { get; set; }

        [ForeignKey("UserId")]
        public virtual ApplicationUser User { get; set; }

        public DateTime JoinDate { get; set; } = DateTime.Now;

        public DateTime ExpiryDate { get; set; }

        [Column(TypeName = "decimal(5,2)")]
        public decimal DiscountRate { get; set; } = 15.00m; // 15%

        [MaxLength(50)]
        public string MembershipType { get; set; } = "Annual"; // Annual

        public bool IsActive { get; set; } = true;

        public int RenewalCount { get; set; } = 0;
    }
}