using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MiraeLuxe.API.Models
{
    public class SkinQuizResult
    {
        [Key]
        public int QuizId { get; set; }

        public string UserId { get; set; } // Optional - can be null for guest users

        [ForeignKey("UserId")]
        public virtual ApplicationUser User { get; set; }

        [MaxLength(50)]
        public string SkinType { get; set; } // Oily, Dry, Combination, Sensitive, Normal

        [MaxLength(200)]
        public string SkinConcerns { get; set; } // Acne, Pigmentation, Dryness (comma-separated)

        [MaxLength(50)]
        public string BudgetRange { get; set; } // Under AED 100, AED 100-200, AED 200+

        public string RecommendedProducts { get; set; } // JSON array of product IDs

        public DateTime QuizDate { get; set; } = DateTime.Now;
    }
}