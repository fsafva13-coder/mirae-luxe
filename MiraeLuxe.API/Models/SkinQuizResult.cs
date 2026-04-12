using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MiraeLuxe.API.Models
{
    public class SkinQuizResult
    {
        [Key]
        public int QuizId { get; set; }

        public string UserId { get; set; } 

        [ForeignKey("UserId")]
        public virtual ApplicationUser User { get; set; }

        [MaxLength(50)]
        public string SkinType { get; set; } 

        [MaxLength(200)]
        public string SkinConcerns { get; set; } 

        [MaxLength(50)]
        public string BudgetRange { get; set; } 

        public string RecommendedProducts { get; set; } 

        public DateTime QuizDate { get; set; } = DateTime.Now;
    }
}