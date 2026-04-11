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
    [Authorize]
    public class MembershipController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public MembershipController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Membership/Status
        [HttpGet("Status")]
        public async Task<ActionResult> GetMembershipStatus()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var user = await _context.Users
                .Include(u => u.Membership)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
                return NotFound(new { Message = "User not found" });

            if (user.Membership == null)
            {
                return Ok(new
                {
                    IsMember = false,
                    Message = "Not a member",
                    Price = "AED 99/year"
                });
            }

            bool isActiveMember = user.Membership.IsActive &&
                                  user.Membership.ExpiryDate > DateTime.Now;

            if (!isActiveMember)
            {
                if (user.IsMember)
                {
                    user.IsMember = false;
                    user.Membership.IsActive = false;
                    await _context.SaveChangesAsync();
                }

                return Ok(new
                {
                    IsMember = false,
                    Message = "Membership expired or inactive",
                    Price = "AED 99/year"
                });
            }

            if (!user.IsMember)
            {
                user.IsMember = true;
                await _context.SaveChangesAsync();
            }

            var daysRemaining = (user.Membership.ExpiryDate - DateTime.Now).Days;

            return Ok(new
            {
                IsMember = true,
                MembershipId = user.Membership.MembershipId,
                JoinDate = user.Membership.JoinDate,
                ExpiryDate = user.Membership.ExpiryDate,
                DaysRemaining = daysRemaining,
                DiscountRate = user.Membership.DiscountRate,
                MembershipType = user.Membership.MembershipType,
                RenewalCount = user.Membership.RenewalCount,
                IsActive = user.Membership.IsActive
            });
        }

        // POST: api/Membership/Join
        [HttpPost("Join")]
        public async Task<ActionResult> JoinMembership([FromBody] JoinMembershipModel model)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var user = await _context.Users
                .Include(u => u.Membership)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
                return NotFound(new { Message = "User not found" });

            // Check if already has a valid active membership
            if (user.Membership != null &&
                user.Membership.IsActive &&
                user.Membership.ExpiryDate > DateTime.Now)
            {
                return BadRequest(new { Message = "Already an active member" });
            }

            var now = DateTime.Now;

            if (user.Membership != null)
            {
                // Reactivate existing expired/inactive membership record
                user.Membership.JoinDate = now;
                user.Membership.ExpiryDate = now.AddYears(1);
                user.Membership.IsActive = true;
                user.Membership.DiscountRate = 15.00m;
                user.Membership.MembershipType = "Annual";
                user.Membership.RenewalCount = user.Membership.RenewalCount + 1;
            }
            else
            {
                // Create brand new membership
                var membership = new Membership
                {
                    UserId = userId,
                    JoinDate = now,
                    ExpiryDate = now.AddYears(1),
                    DiscountRate = 15.00m,
                    MembershipType = "Annual",
                    IsActive = true,
                    RenewalCount = 0
                };
                _context.Memberships.Add(membership);
            }

            user.IsMember = true;
            await _context.SaveChangesAsync();

            return Ok(new
            {
                Message = "Membership activated successfully!",
                ExpiryDate = user.Membership?.ExpiryDate ?? now.AddYears(1),
                Benefits = new[]
                {
                    "✓ 15% off on every order",
                    "✓ Free gift with every purchase",
                    "✓ Free shipping on all orders",
                    "✓ Early access to new products",
                    "✓ Member-only sales",
                    "✓ Birthday gift"
                }
            });
        }

        // POST: api/Membership/Renew
        [HttpPost("Renew")]
        public async Task<ActionResult> RenewMembership()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var membership = await _context.Memberships
                .FirstOrDefaultAsync(m => m.UserId == userId);

            if (membership == null)
                return NotFound(new { Message = "No membership found. Please join first." });

            membership.ExpiryDate = membership.ExpiryDate > DateTime.Now
                ? membership.ExpiryDate.AddYears(1)
                : DateTime.Now.AddYears(1);

            membership.IsActive = true;
            membership.RenewalCount++;

            var user = await _context.Users.FindAsync(userId);
            if (user != null)
                user.IsMember = true;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                Message = "Membership renewed successfully!",
                NewExpiryDate = membership.ExpiryDate,
                RenewalCount = membership.RenewalCount
            });
        }

        // POST: api/Membership/Cancel
        [HttpPost("Cancel")]
        public async Task<ActionResult> CancelMembership()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var user = await _context.Users
                .Include(u => u.Membership)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
                return NotFound(new { Message = "User not found" });

            if (user.Membership == null || !user.Membership.IsActive)
                return BadRequest(new { Message = "No active membership to cancel" });

            user.Membership.IsActive = false;
            user.IsMember = false;
            await _context.SaveChangesAsync();

            return Ok(new
            {
                Message = "Membership cancelled. Benefits remain active until expiry date.",
                ExpiryDate = user.Membership.ExpiryDate
            });
        }

        // GET: api/Membership/Benefits
        [HttpGet("Benefits")]
        public ActionResult GetBenefits()
        {
            return Ok(new
            {
                Price = "AED 99/year",
                Benefits = new[]
                {
                    new { Icon = "🎁", Title = "Free Mini Product",  Description = "Get a free mini product with EVERY order" },
                    new { Icon = "💰", Title = "15% Discount",       Description = "Save 15% on every purchase, automatically applied" },
                    new { Icon = "⭐", Title = "Early Access",       Description = "Be the first to shop new product launches" },
                    new { Icon = "🎉", Title = "Exclusive Sales",    Description = "Access member-only sales and promotions" },
                    new { Icon = "💬", Title = "Priority Support",   Description = "Get faster response from our customer service team" },
                    new { Icon = "🎂", Title = "Birthday Gift",      Description = "Special surprise on your birthday month" }
                }
            });
        }

        // GET: api/Membership/Savings
        [HttpGet("Savings")]
        public async Task<ActionResult> GetMembershipSavings()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var orders = await _context.Orders
                .Where(o => o.UserId == userId && o.DiscountAmount > 0)
                .ToListAsync();

            var totalSavings = orders.Sum(o => o.DiscountAmount);
            var orderCount = orders.Count;

            return Ok(new
            {
                TotalSavings = totalSavings,
                OrdersWithDiscount = orderCount,
                AverageSavingsPerOrder = orderCount > 0 ? totalSavings / orderCount : 0,
                Message = $"You've saved AED {totalSavings:F2} so far!"
            });
        }
    }

    // DTO Model
    public class JoinMembershipModel
    {
        public string? PaymentMethod { get; set; }  // ← THE FIX: nullable
    }
}