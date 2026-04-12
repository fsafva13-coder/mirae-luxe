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
    public class CartController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CartController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult> GetCart()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var cart = await _context.Carts
                .Include(c => c.CartItems)
                    .ThenInclude(ci => ci.Product)
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (cart == null)
            {
                cart = new Cart
                {
                    UserId = userId,
                    CreatedDate = DateTime.Now,
                    UpdatedDate = DateTime.Now,
                    CartItems = new List<CartItem>()
                };
                _context.Carts.Add(cart);
                await _context.SaveChangesAsync();
            }

            var subtotal = cart.CartItems.Sum(ci => ci.Product.Price * ci.Quantity);

            return Ok(new
            {
                cart.CartId,
                Items = cart.CartItems.Select(ci => new
                {
                    ci.CartItemId,
                    ci.ProductId,
                    ci.Product.Name,
                    ci.Product.Brand,
                    ci.Product.Price,
                    ci.Product.ImageUrl1,
                    ci.Quantity,
                    ci.SelectedShade,
                    Subtotal = ci.Product.Price * ci.Quantity
                }),
                ItemCount = cart.CartItems.Count,
                Subtotal = subtotal
            });
        }

        [HttpPost("AddItem")]
        public async Task<ActionResult> AddItem([FromBody] AddToCartModel model)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var product = await _context.Products.FindAsync(model.ProductId);
            if (product == null)
                return NotFound(new { Message = "Product not found" });

            if (product.StockQuantity < model.Quantity)
                return BadRequest(new { Message = "Insufficient stock" });

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

            var existingItem = cart.CartItems
                .FirstOrDefault(ci => ci.ProductId == model.ProductId &&
                                     ci.SelectedShade == (model.SelectedShade ?? string.Empty));

            if (existingItem != null)
            {
                existingItem.Quantity += model.Quantity;
            }
            else
            {
                var cartItem = new CartItem
                {
                    CartId = cart.CartId,
                    ProductId = model.ProductId,
                    Quantity = model.Quantity,
                    SelectedShade = model.SelectedShade ?? string.Empty,
                    AddedDate = DateTime.Now
                };
                _context.CartItems.Add(cartItem);
            }

            cart.UpdatedDate = DateTime.Now;
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Item added to cart successfully" });
        }

        [HttpPut("UpdateQuantity")]
        public async Task<ActionResult> UpdateQuantity([FromBody] UpdateCartItemModel model)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var cartItem = await _context.CartItems
                .Include(ci => ci.Cart)
                .Include(ci => ci.Product)
                .FirstOrDefaultAsync(ci => ci.CartItemId == model.CartItemId &&
                                          ci.Cart.UserId == userId);

            if (cartItem == null)
                return NotFound(new { Message = "Cart item not found" });

            if (model.Quantity <= 0)
                return BadRequest(new { Message = "Quantity must be greater than 0" });

            if (cartItem.Product == null)
                return BadRequest(new { Message = "Product data unavailable" });

            if (cartItem.Product.StockQuantity < model.Quantity)
                return BadRequest(new { Message = "Insufficient stock" });

            cartItem.Quantity = model.Quantity;
            cartItem.Cart.UpdatedDate = DateTime.Now;
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Quantity updated successfully" });
        }

        [HttpDelete("RemoveItem/{cartItemId}")]
        public async Task<ActionResult> RemoveItem(int cartItemId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var cartItem = await _context.CartItems
                .Include(ci => ci.Cart)
                .FirstOrDefaultAsync(ci => ci.CartItemId == cartItemId &&
                                          ci.Cart.UserId == userId);

            if (cartItem == null)
                return NotFound(new { Message = "Cart item not found" });

            _context.CartItems.Remove(cartItem);
            cartItem.Cart.UpdatedDate = DateTime.Now;
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Item removed from cart" });
        }

        [HttpDelete("Clear")]
        public async Task<ActionResult> ClearCart()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var cart = await _context.Carts
                .Include(c => c.CartItems)
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (cart == null)
                return NotFound(new { Message = "Cart not found" });

            _context.CartItems.RemoveRange(cart.CartItems);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Cart cleared successfully" });
        }
    }

    public class AddToCartModel
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; } = 1;
        public string? SelectedShade { get; set; }

        public class UpdateCartItemModel
        {
            public int CartItemId { get; set; }
            public int Quantity { get; set; }
        }
    }
}