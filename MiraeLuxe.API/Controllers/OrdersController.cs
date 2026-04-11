using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MiraeLuxe.API.Data;
using MiraeLuxe.API.Models;
using System.Security.Claims;

namespace MiraeLuxe.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class OrdersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public OrdersController(ApplicationDbContext context)
        {
            _context = context;
        }

        // POST: api/Orders/Checkout
        [HttpPost("Checkout")]
        public async Task<ActionResult> Checkout([FromBody] CheckoutModel model)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var user = await _context.Users
                .Include(u => u.Membership)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
                return Unauthorized();

            var cart = await _context.Carts
                .Include(c => c.CartItems)
                    .ThenInclude(ci => ci.Product)
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (cart == null || !cart.CartItems.Any())
                return BadRequest(new { Message = "Cart is empty" });

            decimal subtotal = cart.CartItems.Sum(ci => ci.Product.Price * ci.Quantity);
            decimal discountAmount = 0;
            int? freeGiftProductId = null;

            bool isMember = user.IsMember &&
                            user.Membership != null &&
                            user.Membership.IsActive &&
                            user.Membership.ExpiryDate > DateTime.Now;

            if (isMember)
            {
                discountAmount = subtotal * 0.15m;
                freeGiftProductId = await GetAvailableGiftProduct();
            }
            else if (subtotal >= 120)
            {
                freeGiftProductId = await GetAvailableGiftProduct();
            }

            decimal finalTotal = subtotal - discountAmount + model.ShippingFee;

            var order = new Order
            {
                UserId = userId,
                OrderDate = DateTime.Now,
                Subtotal = subtotal,
                DiscountAmount = discountAmount,
                ShippingFee = model.ShippingFee,
                FinalTotal = finalTotal,
                Status = "Pending",
                ShippingAddress = model.ShippingAddress ?? string.Empty,
                PaymentMethod = model.PaymentMethod ?? "Card",
                TrackingNumber = GenerateTrackingNumber(),
                FreeGiftProductId = freeGiftProductId
            };

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            foreach (var cartItem in cart.CartItems)
            {
                var orderItem = new OrderItem
                {
                    OrderId = order.OrderId,
                    ProductId = cartItem.ProductId,
                    Quantity = cartItem.Quantity,
                    Price = cartItem.Product.Price,
                    Subtotal = cartItem.Product.Price * cartItem.Quantity,
                    IsFreeGift = false,
                    SelectedShade = cartItem.SelectedShade ?? string.Empty
                };
                _context.OrderItems.Add(orderItem);

                cartItem.Product.StockQuantity -= cartItem.Quantity;
            }

            if (freeGiftProductId.HasValue)
            {
                var giftItem = new OrderItem
                {
                    OrderId = order.OrderId,
                    ProductId = freeGiftProductId.Value,
                    Quantity = 1,
                    Price = 0,
                    Subtotal = 0,
                    IsFreeGift = true,
                    SelectedShade = string.Empty
                };
                _context.OrderItems.Add(giftItem);

                var giftProduct = await _context.Products.FindAsync(freeGiftProductId.Value);
                if (giftProduct != null)
                    giftProduct.StockQuantity -= 1;
            }

            var payment = new Payment
            {
                OrderId = order.OrderId,
                Amount = finalTotal,
                PaymentMethod = model.PaymentMethod ?? "Card",
                TransactionId = GenerateTransactionId(),
                PaymentDate = DateTime.Now,
                Status = "Success"
            };
            _context.Payments.Add(payment);

            order.Status = "Paid";
            _context.CartItems.RemoveRange(cart.CartItems);

            await _context.SaveChangesAsync();

            return Ok(new
            {
                Message = "Order placed successfully",
                OrderId = order.OrderId,
                TrackingNumber = order.TrackingNumber,
                Subtotal = subtotal,
                DiscountAmount = discountAmount,
                FinalTotal = finalTotal,
                FreeGiftIncluded = freeGiftProductId.HasValue,
                IsMemberOrder = isMember
            });
        }

        // GET: api/Orders/History
        [HttpGet("History")]
        public async Task<ActionResult> GetOrderHistory()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var orders = await _context.Orders
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Product)
                .Include(o => o.Payment)
                .Where(o => o.UserId == userId)
                .OrderByDescending(o => o.OrderDate)
                .Select(o => new
                {
                    o.OrderId,
                    o.OrderDate,
                    o.Subtotal,
                    o.DiscountAmount,
                    o.FinalTotal,
                    o.Status,
                    o.TrackingNumber,
                    o.DeliveryDate,
                    ItemCount = o.OrderItems.Count(oi => !oi.IsFreeGift),
                    HasFreeGift = o.OrderItems.Any(oi => oi.IsFreeGift),
                    Items = o.OrderItems.Select(oi => new
                    {
                        oi.ProductId,
                        oi.Product.Name,
                        oi.Product.Brand,
                        oi.Product.ImageUrl1,
                        oi.Quantity,
                        oi.Price,
                        oi.IsFreeGift
                    })
                })
                .ToListAsync();

            return Ok(orders);
        }

        // GET: api/Orders/5
        [HttpGet("{id}")]
        public async Task<ActionResult> GetOrder(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var order = await _context.Orders
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Product)
                .Include(o => o.Payment)
                .FirstOrDefaultAsync(o => o.OrderId == id && o.UserId == userId);

            if (order == null)
                return NotFound(new { Message = "Order not found" });

            return Ok(new
            {
                order.OrderId,
                order.OrderDate,
                order.Subtotal,
                order.DiscountAmount,
                order.ShippingFee,
                order.FinalTotal,
                order.Status,
                order.ShippingAddress,
                order.TrackingNumber,
                order.DeliveryDate,
                PaymentMethod = order.Payment?.PaymentMethod,
                PaymentStatus = order.Payment?.Status,
                Items = order.OrderItems.Select(oi => new
                {
                    oi.ProductId,
                    oi.Product.Name,
                    oi.Product.Brand,
                    oi.Product.ImageUrl1,
                    oi.Quantity,
                    oi.Price,
                    oi.Subtotal,
                    oi.IsFreeGift,
                    oi.SelectedShade
                })
            });
        }

        // GET: api/Orders/Track/{trackingNumber}
        [HttpGet("Track/{trackingNumber}")]
        public async Task<ActionResult> TrackOrder(string trackingNumber)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var order = await _context.Orders
                .FirstOrDefaultAsync(o => o.TrackingNumber == trackingNumber &&
                                         o.UserId == userId);

            if (order == null)
                return NotFound(new { Message = "Order not found" });

            var trackingStages = new List<object>();

            trackingStages.Add(new
            {
                Stage = "Order Placed",
                Date = order.OrderDate,
                Completed = true,
                Description = "Your order has been received"
            });

            if (order.Status != "Pending")
            {
                trackingStages.Add(new
                {
                    Stage = "Payment Confirmed",
                    Date = order.OrderDate.AddMinutes(5),
                    Completed = true,
                    Description = "Payment successfully processed"
                });
            }

            if (order.Status == "Processing" || order.Status == "Shipped" ||
                order.Status == "Delivered")
            {
                trackingStages.Add(new
                {
                    Stage = "Processing",
                    Date = order.OrderDate.AddHours(2),
                    Completed = true,
                    Description = "Your order is being prepared"
                });
            }

            if (order.Status == "Shipped" || order.Status == "Delivered")
            {
                trackingStages.Add(new
                {
                    Stage = "Shipped",
                    Date = order.OrderDate.AddDays(1),
                    Completed = true,
                    Description = "Your order has been dispatched"
                });
            }

            if (order.Status == "Delivered")
            {
                trackingStages.Add(new
                {
                    Stage = "Delivered",
                    Date = order.DeliveryDate ?? order.OrderDate.AddDays(3),
                    Completed = true,
                    Description = "Order delivered successfully"
                });
            }
            else
            {
                trackingStages.Add(new
                {
                    Stage = "Out for Delivery",
                    Date = (DateTime?)null,
                    Completed = false,
                    Description = "Estimated delivery in 2-3 days"
                });
            }

            return Ok(new
            {
                order.OrderId,
                order.TrackingNumber,
                order.Status,
                TrackingStages = trackingStages
            });
        }

        private async Task<int?> GetAvailableGiftProduct()
        {
            var giftProduct = await _context.Products
                .Where(p => p.IsMiniGift && p.StockQuantity > 0)
                .OrderBy(p => Guid.NewGuid())
                .Select(p => p.ProductId)
                .FirstOrDefaultAsync();

            return giftProduct != 0 ? giftProduct : null;
        }

        private string GenerateTrackingNumber()
        {
            return $"ML{DateTime.Now:yyyyMMdd}{new Random().Next(1000, 9999)}";
        }

        private string GenerateTransactionId()
        {
            return $"TXN{DateTime.Now:yyyyMMddHHmmss}{new Random().Next(100, 999)}";
        }
    }

    // DTO Model
    public class CheckoutModel
    {
        public string? ShippingAddress { get; set; }  // ← THE FIX: nullable
        public string? PaymentMethod { get; set; }    // ← THE FIX: nullable
        public decimal ShippingFee { get; set; } = 0;
    }
}