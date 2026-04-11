using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using MiraeLuxe.API.Data;
using MiraeLuxe.API.Models;

namespace MiraeLuxe.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReviewsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ReviewsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Reviews/Product/5
        [HttpGet("Product/{productId}")]
        public async Task<ActionResult> GetProductReviews(int productId)
        {
            var reviews = await _context.Reviews
                .Include(r => r.User)
                .Where(r => r.ProductId == productId)
                .OrderByDescending(r => r.ReviewDate)
                .Select(r => new
                {
                    r.ReviewId,
                    r.Rating,
                    r.Title,
                    r.Comment,
                    r.ReviewDate,
                    r.IsVerifiedPurchase,
                    r.HelpfulCount,
                    ReviewerName = $"{r.User.FirstName} {r.User.LastName.Substring(0, 1)}.",
                    ReviewerInitials = $"{r.User.FirstName.Substring(0, 1)}{r.User.LastName.Substring(0, 1)}"
                })
                .ToListAsync();

            var averageRating = reviews.Any() ? reviews.Average(r => r.Rating) : 0;

            return Ok(new
            {
                ProductId = productId,
                TotalReviews = reviews.Count,
                AverageRating = Math.Round(averageRating, 1),
                RatingDistribution = new
                {
                    FiveStar = reviews.Count(r => r.Rating == 5),
                    FourStar = reviews.Count(r => r.Rating == 4),
                    ThreeStar = reviews.Count(r => r.Rating == 3),
                    TwoStar = reviews.Count(r => r.Rating == 2),
                    OneStar = reviews.Count(r => r.Rating == 1)
                },
                Reviews = reviews
            });
        }

        // POST: api/Reviews
        [Authorize]
        [HttpPost]
        public async Task<ActionResult> AddReview([FromBody] AddReviewModel model)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            // Check if product exists
            var product = await _context.Products.FindAsync(model.ProductId);
            if (product == null)
                return NotFound(new { Message = "Product not found" });

            // Check if user already reviewed this product
            var existingReview = await _context.Reviews
                .FirstOrDefaultAsync(r => r.UserId == userId && r.ProductId == model.ProductId);

            if (existingReview != null)
                return BadRequest(new { Message = "You have already reviewed this product" });

            // Check if verified purchase
            var hasPurchased = await _context.OrderItems
                .Include(oi => oi.Order)
                .AnyAsync(oi => oi.ProductId == model.ProductId &&
                               oi.Order.UserId == userId &&
                               oi.Order.Status == "Delivered");

            var review = new Review
            {
                ProductId = model.ProductId,
                UserId = userId,
                Rating = model.Rating,
                Title = model.Title,
                Comment = model.Comment,
                ReviewDate = DateTime.Now,
                IsVerifiedPurchase = hasPurchased,
                HelpfulCount = 0
            };

            _context.Reviews.Add(review);

            // Update product rating
            var allReviews = await _context.Reviews
                .Where(r => r.ProductId == model.ProductId)
                .ToListAsync();
            allReviews.Add(review); // Include new review

            product.Rating = (decimal)allReviews.Average(r => r.Rating);
            product.ReviewCount = allReviews.Count;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                Message = "Review submitted successfully",
                ReviewId = review.ReviewId,
                IsVerifiedPurchase = hasPurchased
            });
        }

        // PUT: api/Reviews/5
        [Authorize]
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateReview(int id, [FromBody] UpdateReviewModel model)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var review = await _context.Reviews
                .Include(r => r.Product)
                .FirstOrDefaultAsync(r => r.ReviewId == id && r.UserId == userId);

            if (review == null)
                return NotFound(new { Message = "Review not found" });

            review.Rating = model.Rating;
            review.Title = model.Title;
            review.Comment = model.Comment;

            // Update product rating
            var allReviews = await _context.Reviews
                .Where(r => r.ProductId == review.ProductId)
                .ToListAsync();

            review.Product.Rating = (decimal)allReviews.Average(r => r.Rating);

            await _context.SaveChangesAsync();

            return Ok(new { Message = "Review updated successfully" });
        }

        // DELETE: api/Reviews/5
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteReview(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var review = await _context.Reviews
                .Include(r => r.Product)
                .FirstOrDefaultAsync(r => r.ReviewId == id && r.UserId == userId);

            if (review == null)
                return NotFound(new { Message = "Review not found" });

            var productId = review.ProductId;
            _context.Reviews.Remove(review);
            await _context.SaveChangesAsync();

            // Update product rating
            var remainingReviews = await _context.Reviews
                .Where(r => r.ProductId == productId)
                .ToListAsync();

            var product = await _context.Products.FindAsync(productId);
            if (product != null)
            {
                product.Rating = remainingReviews.Any()
                    ? (decimal)remainingReviews.Average(r => r.Rating)
                    : 0;
                product.ReviewCount = remainingReviews.Count;
                await _context.SaveChangesAsync();
            }

            return Ok(new { Message = "Review deleted successfully" });
        }

        // POST: api/Reviews/5/Helpful
        [Authorize]
        [HttpPost("{id}/Helpful")]
        public async Task<ActionResult> MarkReviewHelpful(int id)
        {
            var review = await _context.Reviews.FindAsync(id);
            if (review == null)
                return NotFound(new { Message = "Review not found" });

            review.HelpfulCount++;
            await _context.SaveChangesAsync();

            return Ok(new
            {
                Message = "Marked as helpful",
                HelpfulCount = review.HelpfulCount
            });
        }

        // GET: api/Reviews/PendingReminder
        [Authorize]
        [HttpGet("PendingReminder")]
        public async Task<ActionResult> GetPendingReviewReminder()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            // Find delivered orders without reviews
            var deliveredOrders = await _context.Orders
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Product)
                .Where(o => o.UserId == userId &&
                           o.Status == "Delivered" &&
                           o.DeliveryDate.HasValue)
                .ToListAsync();

            if (!deliveredOrders.Any())
                return Ok(new { ShowReminder = false });

            // Get products user hasn't reviewed yet
            var reviewedProductIds = await _context.Reviews
                .Where(r => r.UserId == userId)
                .Select(r => r.ProductId)
                .ToListAsync();

            var productsToReview = deliveredOrders
                .SelectMany(o => o.OrderItems)
                .Where(oi => !oi.IsFreeGift && !reviewedProductIds.Contains(oi.ProductId))
                .Select(oi => new
                {
                    oi.ProductId,
                    oi.Product.Name,
                    oi.Product.Brand,
                    oi.Product.ImageUrl1
                })
                .DistinctBy(p => p.ProductId)
                .Take(3) // Show max 3 products
                .ToList();

            if (!productsToReview.Any())
                return Ok(new { ShowReminder = false });

            return Ok(new
            {
                ShowReminder = true,
                Message = "How was your recent purchase? Share your experience!",
                Products = productsToReview
            });
        }

        // POST: api/Reviews/DismissReminder
        [Authorize]
        [HttpPost("DismissReminder")]
        public ActionResult DismissReminder()
        {
            // In a real app, you'd store this in database or session
            // For now, just return success
            // Frontend will handle not showing the reminder again for this session
            return Ok(new { Message = "Reminder dismissed" });
        }
    }

    // DTO Models for ReviewsController
    public class AddReviewModel
    {
        public int ProductId { get; set; }
        public int Rating { get; set; } // 1-5
        public string Title { get; set; }
        public string Comment { get; set; }
    }

    public class UpdateReviewModel
    {
        public int Rating { get; set; }
        public string Title { get; set; }
        public string Comment { get; set; }
    }
}