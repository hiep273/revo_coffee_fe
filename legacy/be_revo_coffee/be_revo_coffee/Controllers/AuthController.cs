using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace be_revo_coffee.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _config;

        public AuthController(IConfiguration config)
        {
            _config = config;
        }

        public class Credentials { public string Email { get; set; } public string Password { get; set; } }

        [HttpPost("register")]
        public IActionResult Register([FromBody] Credentials creds)
        {
            // Simple stub: in production, validate and persist user securely
            return Ok(new { success = true, message = "registered (stub)", email = creds?.Email });
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] Credentials creds)
        {
            // Development-only: accept a single hardcoded admin user
            if (creds == null || string.IsNullOrEmpty(creds.Email) || string.IsNullOrEmpty(creds.Password))
                return BadRequest(new { success = false, message = "invalid credentials" });

            // Replace this check with real user store / password hashing
            var isAdmin = creds.Email == "admin@revo.local" && creds.Password == "adminpass";
            if (!isAdmin)
                return Unauthorized(new { success = false, message = "invalid email or password" });

            var claims = new[] {
                new Claim(ClaimTypes.Name, creds.Email),
                new Claim(ClaimTypes.Role, "Admin")
            };

            var keyString = _config["Jwt:Key"] ?? "SuperSecretDevKey_ChangeMe_2026";
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(keyString));
            var credsSigning = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"] ?? "revo",
                audience: _config["Jwt:Audience"] ?? "revo",
                claims: claims,
                expires: DateTime.UtcNow.AddHours(8),
                signingCredentials: credsSigning
            );

            var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

            return Ok(new { success = true, token = tokenString, email = creds.Email });
        }
    }
}
