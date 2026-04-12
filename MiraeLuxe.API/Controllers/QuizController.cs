using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MiraeLuxe.API.Controllers;
using MiraeLuxe.API.Data;
using MiraeLuxe.API.Models;
using System.Security.Claims;

namespace MiraeLuxe.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuizController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public QuizController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("Submit")]
        public async Task<ActionResult> SubmitQuiz([FromBody] SkinQuizSubmission model)
        {
            var userId = User?.FindFirstValue(ClaimTypes.NameIdentifier);

            var query = _context.Products
                .Where(p => !p.IsMiniGift && p.StockQuantity > 0)
                .AsQueryable();

            if (!string.IsNullOrEmpty(model.SkinType))
            {
                query = query.Where(p => p.SkinType.Contains(model.SkinType) ||
                                        p.SkinType.Contains("All"));
            }

            if (!string.IsNullOrEmpty(model.BudgetRange))
            {
                switch (model.BudgetRange)
                {
                    case "Under AED 100":
                        query = query.Where(p => p.Price < 100);
                        break;
                    case "AED 100-150":
                        query = query.Where(p => p.Price >= 100 && p.Price <= 150);
                        break;
                    case "AED 150-200":
                        query = query.Where(p => p.Price >= 150 && p.Price <= 200);
                        break;
                    case "Above AED 200":
                        query = query.Where(p => p.Price > 200);
                        break;
                }
            }

            if (!string.IsNullOrEmpty(model.Preferences))
            {
                if (model.Preferences.Contains("Vegan"))
                    query = query.Where(p => p.IsVegan);
                if (model.Preferences.Contains("Cruelty-free"))
                    query = query.Where(p => p.IsCrueltyFree);
            }

            var recommendations = new List<object>();

            if (model.Concerns.Contains("Acne"))
            {
                var acneProducts = await query
                    .Where(p => p.SubCategory == "Facial Cleanser" ||
                               p.SubCategory == "Toner" ||
                               p.SubCategory == "Serum")
                    .OrderByDescending(p => p.Rating)
                    .Take(3)
                    .ToListAsync();

                recommendations.Add(new
                {
                    Concern = "Acne",
                    Recommendation = "Focus on gentle cleansing and salicylic acid treatments",
                    Products = acneProducts.Select(p => new
                    {
                        p.ProductId,
                        p.Name,
                        p.Brand,
                        p.Price,
                        p.ImageUrl1,
                        p.Rating,
                        p.SubCategory
                    })
                });
            }

            if (model.Concerns.Contains("Dark Spots") || model.Concerns.Contains("Pigmentation"))
            {
                var brighteningProducts = await query
                    .Where(p => p.SubCategory == "Serum" ||
                               p.SubCategory == "Moisturizer")
                    .OrderByDescending(p => p.Rating)
                    .Take(3)
                    .ToListAsync();

                recommendations.Add(new
                {
                    Concern = "Brightening",
                    Recommendation = "Vitamin C serums and niacinamide can help fade dark spots",
                    Products = brighteningProducts.Select(p => new
                    {
                        p.ProductId,
                        p.Name,
                        p.Brand,
                        p.Price,
                        p.ImageUrl1,
                        p.Rating,
                        p.SubCategory
                    })
                });
            }

            if (model.Concerns.Contains("Dryness") || model.Concerns.Contains("Dehydration"))
            {
                var hydratingProducts = await query
                    .Where(p => p.SubCategory == "Moisturizer" ||
                               p.SubCategory == "Serum")
                    .OrderByDescending(p => p.Rating)
                    .Take(3)
                    .ToListAsync();

                recommendations.Add(new
                {
                    Concern = "Hydration",
                    Recommendation = "Look for hyaluronic acid and ceramides for deep hydration",
                    Products = hydratingProducts.Select(p => new
                    {
                        p.ProductId,
                        p.Name,
                        p.Brand,
                        p.Price,
                        p.ImageUrl1,
                        p.Rating,
                        p.SubCategory
                    })
                });
            }

            if (model.Concerns.Contains("Fine Lines") || model.Concerns.Contains("Aging"))
            {
                var antiAgingProducts = await query
                    .Where(p => p.SubCategory == "Serum" ||
                               p.SubCategory == "Eye Cream" ||
                               p.SubCategory == "Moisturizer")
                    .OrderByDescending(p => p.Rating)
                    .Take(3)
                    .ToListAsync();

                recommendations.Add(new
                {
                    Concern = "Anti-Aging",
                    Recommendation = "Retinol and peptides are excellent for reducing fine lines",
                    Products = antiAgingProducts.Select(p => new
                    {
                        p.ProductId,
                        p.Name,
                        p.Brand,
                        p.Price,
                        p.ImageUrl1,
                        p.Rating,
                        p.SubCategory
                    })
                });
            }

            var essentials = await query
                .Where(p => p.SubCategory == "Sunscreen" ||
                           p.SubCategory == "Facial Cleanser")
                .OrderByDescending(p => p.Rating)
                .Take(2)
                .ToListAsync();

            recommendations.Add(new
            {
                Concern = "Daily Essentials",
                Recommendation = "Every routine needs a good cleanser and sunscreen",
                Products = essentials.Select(p => new
                {
                    p.ProductId,
                    p.Name,
                    p.Brand,
                    p.Price,
                    p.ImageUrl1,
                    p.Rating,
                    p.SubCategory
                })
            });

            if (!string.IsNullOrEmpty(userId))
            {
                var recommendedProductIds = new List<int>();

                foreach (var recommendation in recommendations)
                {
                    var recType = recommendation.GetType();
                    var productsProperty = recType.GetProperty("Products");
                    if (productsProperty != null)
                    {
                        var products = productsProperty.GetValue(recommendation) as IEnumerable<object>;
                        if (products != null)
                        {
                            foreach (var product in products)
                            {
                                var productType = product.GetType();
                                var productIdProperty = productType.GetProperty("ProductId");
                                if (productIdProperty != null)
                                {
                                    var productId = (int)productIdProperty.GetValue(product);
                                    if (!recommendedProductIds.Contains(productId))
                                    {
                                        recommendedProductIds.Add(productId);
                                    }
                                }
                            }
                        }
                    }
                }

                var quizResult = new SkinQuizResult
                {
                    UserId = userId,
                    SkinType = model.SkinType,
                    SkinConcerns = string.Join(", ", model.Concerns),
                    BudgetRange = model.BudgetRange,
                    RecommendedProducts = string.Join(",", recommendedProductIds),
                    QuizDate = DateTime.Now
                };

                _context.SkinQuizResults.Add(quizResult);
                await _context.SaveChangesAsync();
            }

            return Ok(new
            {
                Message = "Quiz completed successfully!",
                SkinType = model.SkinType,
                Concerns = model.Concerns,
                BudgetRange = model.BudgetRange,
                Preferences = model.Preferences,
                Recommendations = recommendations,
                RoutineAdvice = GetRoutineAdvice(model.SkinType, model.Concerns)
            });
        }

        [Authorize]
        [HttpGet("History")]
        public async Task<ActionResult> GetQuizHistory()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var history = await _context.SkinQuizResults
                .Where(q => q.UserId == userId)
                .OrderByDescending(q => q.QuizDate)
                .Select(q => new
                {
                    q.QuizId,
                    q.SkinType,
                    q.SkinConcerns,
                    q.BudgetRange,
                    q.QuizDate
                })
                .ToListAsync();

            return Ok(history);
        }

        private string GetRoutineAdvice(string skinType, List<string> concerns)
        {
            var advice = $"For {skinType} skin";

            if (concerns.Contains("Acne"))
                advice += ", use gentle, non-comedogenic products. Avoid over-cleansing.";
            else if (concerns.Contains("Dryness"))
                advice += ", focus on hydration and barrier repair. Layer products from thinnest to thickest.";
            else if (concerns.Contains("Fine Lines"))
                advice += ", incorporate retinol at night and always use SPF during the day.";
            else
                advice += ", maintain a consistent routine with cleanser, treatment, moisturizer, and SPF.";

            advice += " Remember: Consistency is key! Give products 4-6 weeks to show results.";

            return advice;
        }
    }

    public class SkinQuizSubmission
    {
        public string SkinType { get; set; } 
        public List<string> Concerns { get; set; } 
        public string BudgetRange { get; set; } 
        public string Preferences { get; set; } 
    }
}