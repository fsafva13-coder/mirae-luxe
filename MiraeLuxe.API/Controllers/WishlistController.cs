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
    public class WishlistController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public WishlistController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult> GetWishlist()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var wishlist = await _context.Wishlists
                .Include(w => w.WishlistItems)
                    .ThenInclude(wi => wi.Product)
                .FirstOrDefaultAsync(w => w.UserId == userId);

            if (wishlist == null)
            {
                wishlist = new Wishlist
                {
                    UserId = userId,
                    CreatedDate = DateTime.Now,
                    WishlistItems = new List<WishlistItem>()
                };
                _context.Wishlists.Add(wishlist);
                await _context.SaveChangesAsync();
            }

            return Ok(new
            {
                wishlist.WishlistId,
                ItemCount = wishlist.WishlistItems.Count,
                Items = wishlist.WishlistItems.Select(wi => new
                {
                    wi.WishlistItemId,
                    wi.ProductId,
                    wi.Product.Name,
                    wi.Product.Brand,
                    wi.Product.Price,
                    wi.Product.ImageUrl1,
                    wi.Product.Rating,
                    wi.Product.ReviewCount,
                    wi.Product.IsVegan,
                    wi.Product.IsCrueltyFree,
                    wi.Product.StockQuantity,
                    InStock = wi.Product.StockQuantity > 0,
                    wi.AddedDate
                }).OrderByDescending(i => i.AddedDate)
            });
        }

        [HttpPost("Add")]
        public async Task<ActionResult> AddToWishlist([FromBody] AddToWishlistModel model)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var product = await _context.Products.FindAsync(model.ProductId);
            if (product == null)
                return NotFound(new { Message = "Product not found" });

            var wishlist = await _context.Wishlists
                .Include(w => w.WishlistItems)
                .FirstOrDefaultAsync(w => w.UserId == userId);

            if (wishlist == null)
            {
                wishlist = new Wishlist
                {
                    UserId = userId,
                    CreatedDate = DateTime.Now
                };
                _context.Wishlists.Add(wishlist);
                await _context.SaveChangesAsync();
            }

            var existingItem = wishlist.WishlistItems
                .FirstOrDefault(wi => wi.ProductId == model.ProductId);

            if (existingItem != null)
                return BadRequest(new { Message = "Product already in wishlist" });

            var wishlistItem = new WishlistItem
            {
                WishlistId = wishlist.WishlistId,
                ProductId = model.ProductId,
                AddedDate = DateTime.Now
            };

            _context.WishlistItems.Add(wishlistItem);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                Message = "Added to wishlist successfully",
                WishlistItemId = wishlistItem.WishlistItemId
            });
        }

        [HttpDelete("Remove/{wishlistItemId}")]
        public async Task<ActionResult> RemoveFromWishlist(int wishlistItemId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var wishlistItem = await _context.WishlistItems
                .Include(wi => wi.Wishlist)
                .FirstOrDefaultAsync(wi => wi.WishlistItemId == wishlistItemId &&
                                          wi.Wishlist.UserId == userId);

            if (wishlistItem == null)
                return NotFound(new { Message = "Wishlist item not found" });

            _context.WishlistItems.Remove(wishlistItem);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Removed from wishlist" });
        }

        [HttpDelete("RemoveProduct/{productId}")]
        public async Task<ActionResult> RemoveProductFromWishlist(int productId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var wishlistItem = await _context.WishlistItems
                .Include(wi => wi.Wishlist)
                .FirstOrDefaultAsync(wi => wi.ProductId == productId &&
                                          wi.Wishlist.UserId == userId);

            if (wishlistItem == null)
                return NotFound(new { Message = "Product not in wishlist" });

            _context.WishlistItems.Remove(wishlistItem);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Removed from wishlist" });
        }

        [HttpGet("Check/{productId}")]
        public async Task<ActionResult> CheckIfInWishlist(int productId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var isInWishlist = await _context.WishlistItems
                .Include(wi => wi.Wishlist)
                .AnyAsync(wi => wi.ProductId == productId && wi.Wishlist.UserId == userId);

            return Ok(new { IsInWishlist = isInWishlist });
        }

        [HttpPost("MoveToCart/{wishlistItemId}")]
        public async Task<ActionResult> MoveToCart(int wishlistItemId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var wishlistItem = await _context.WishlistItems
                .Include(wi => wi.Wishlist)
                .Include(wi => wi.Product)
                .FirstOrDefaultAsync(wi => wi.WishlistItemId == wishlistItemId &&
                                          wi.Wishlist.UserId == userId);

            if (wishlistItem == null)
                return NotFound(new { Message = "Wishlist item not found" });

            if (wishlistItem.Product == null)
                return BadRequest(new { Message = "Product data unavailable" });

            if (wishlistItem.Product.StockQuantity < 1)
                return BadRequest(new { Message = "Product out of stock" });

            var cart = await _context.Carts
                .Include(c => c.CartItems)
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (cart == null)
            {
                cart = new Cart
                {
                    UserId = userId,
                    CreatedDate = DateTime.Now,
                    UpdatedDate = DateTime.Now
                };
                _context.Carts.Add(cart);
                await _context.SaveChangesAsync();
            }

            var existingCartItem = cart.CartItems
                .FirstOrDefault(ci => ci.ProductId == wishlistItem.ProductId);

            if (existingCartItem != null)
            {
                existingCartItem.Quantity++;
            }
            else
            {
                var cartItem = new CartItem
                {
                    CartId = cart.CartId,
                    ProductId = wishlistItem.ProductId,
                    Quantity = 1,
                    SelectedShade = string.Empty,  
                    AddedDate = DateTime.Now
                };
                _context.CartItems.Add(cartItem);
            }

            _context.WishlistItems.Remove(wishlistItem);
            cart.UpdatedDate = DateTime.Now;
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Moved to cart successfully" });
        }

        [HttpDelete("Clear")]
        public async Task<ActionResult> ClearWishlist()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var wishlist = await _context.Wishlists
                .Include(w => w.WishlistItems)
                .FirstOrDefaultAsync(w => w.UserId == userId);

            if (wishlist == null)
                return NotFound(new { Message = "Wishlist not found" });

            _context.WishlistItems.RemoveRange(wishlist.WishlistItems);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Wishlist cleared successfully" });
        }
    }

    public class AddToWishlistModel
    {
        public int ProductId { get; set; }
    }
}