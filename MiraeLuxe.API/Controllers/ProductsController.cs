using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MiraeLuxe.API.Data;
using MiraeLuxe.API.Models;

namespace MiraeLuxe.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProductsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Product>>> GetProducts(
            [FromQuery] string? category = null,
            [FromQuery] string? subCategory = null,
            [FromQuery] string? skinType = null,
            [FromQuery] bool? isVegan = null,
            [FromQuery] bool? isCrueltyFree = null,
            [FromQuery] decimal? minPrice = null,
            [FromQuery] decimal? maxPrice = null,
            [FromQuery] string? search = null)
        {
            try
            {
                var query = _context.Products
                    .Where(p => !p.IsMiniGift)
                    .AsQueryable();

                if (!string.IsNullOrEmpty(category))
                    query = query.Where(p => p.Category == category);

                if (!string.IsNullOrEmpty(subCategory))
                    query = query.Where(p => p.SubCategory == subCategory);

                if (!string.IsNullOrEmpty(skinType))
                    query = query.Where(p => p.SkinType != null && p.SkinType.Contains(skinType));

                if (isVegan.HasValue)
                    query = query.Where(p => p.IsVegan == isVegan.Value);

                if (isCrueltyFree.HasValue)
                    query = query.Where(p => p.IsCrueltyFree == isCrueltyFree.Value);

                if (minPrice.HasValue)
                    query = query.Where(p => p.Price >= minPrice.Value);

                if (maxPrice.HasValue)
                    query = query.Where(p => p.Price <= maxPrice.Value);

                if (!string.IsNullOrEmpty(search))
                    query = query.Where(p =>
                        p.Name.Contains(search) ||
                        p.Brand.Contains(search) ||
                        (p.Description != null && p.Description.Contains(search)));

                var products = await query.ToListAsync();

                foreach (var product in products)
                {
                    var reviews = await _context.Reviews
                        .Where(r => r.ProductId == product.ProductId)
                        .ToListAsync();

                    product.ReviewCount = reviews.Count;
                    product.Rating = reviews.Any()
                        ? (decimal)reviews.Average(r => r.Rating)
                        : 0;
                }

                return Ok(products);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"ERROR in GetProducts: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                return StatusCode(500, new
                {
                    error = ex.Message,
                    details = ex.InnerException?.Message
                });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProduct(int id)
        {
            try
            {
                var product = await _context.Products
                    .FirstOrDefaultAsync(p => p.ProductId == id);

                if (product == null)
                    return NotFound();

                var reviews = await _context.Reviews
                    .Where(r => r.ProductId == id)
                    .Select(r => new
                    {
                        r.ReviewId,
                        r.ProductId,
                        r.UserId,
                        r.Rating,
                        r.Title,
                        r.Comment,
                        r.ReviewDate,
                        r.IsVerifiedPurchase,
                        r.HelpfulCount,
                        UserName = r.User != null ? r.User.UserName : "Anonymous"
                    })
                    .ToListAsync();

                product.ReviewCount = reviews.Count;
                product.Rating = reviews.Any()
                    ? (decimal)reviews.Average(r => r.Rating)
                    : 0;

                return Ok(new
                {
                    product = product,
                    reviews = reviews
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"ERROR in GetProduct: {ex.Message}");
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpGet("MiniGifts")]
        public async Task<ActionResult<IEnumerable<Product>>> GetMiniGifts()
        {
            try
            {
                var gifts = await _context.Products
                    .Where(p => p.IsMiniGift && p.StockQuantity > 0)
                    .ToListAsync();

                return Ok(gifts);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"ERROR in GetMiniGifts: {ex.Message}");
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpGet("Categories")]
        public async Task<ActionResult> GetCategories()
        {
            try
            {
                var categories = await _context.Products
                    .Select(p => new { p.Category, p.SubCategory })
                    .Distinct()
                    .GroupBy(p => p.Category)
                    .Select(g => new
                    {
                        Category = g.Key,
                        SubCategories = g.Select(x => x.SubCategory).Distinct()
                    })
                    .ToListAsync();

                return Ok(categories);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"ERROR in GetCategories: {ex.Message}");
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpPost]
        public async Task<ActionResult<Product>> CreateProduct(Product product)
        {
            try
            {
                _context.Products.Add(product);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetProduct), new { id = product.ProductId }, product);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"ERROR in CreateProduct: {ex.Message}");
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProduct(int id, Product product)
        {
            if (id != product.ProductId)
                return BadRequest();

            _context.Entry(product).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProductExists(id))
                    return NotFound();
                else
                    throw;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"ERROR in UpdateProduct: {ex.Message}");
                return StatusCode(500, new { error = ex.Message });
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            try
            {
                var product = await _context.Products.FindAsync(id);
                if (product == null)
                    return NotFound();

                _context.Products.Remove(product);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"ERROR in DeleteProduct: {ex.Message}");
                return StatusCode(500, new { error = ex.Message });
            }
        }

        private bool ProductExists(int id)
        {
            return _context.Products.Any(e => e.ProductId == id);
        }
    }
}