using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;

using Cinema.ControllerApi.Services;
using Cinema.Data.Entities;

namespace Cinema.ControllerApi.Services;

public class TokenService : ITokenService
{
    private readonly IConfiguration _config;

    /* The configuration to read appsettings.json */
    public TokenService(IConfiguration config)
    {
        _config = config;
    }

    public string Issue (Users user)
    {
        /* 1- Takes the SecretKey and generates the sign */
        var secretKey = _config["JwtSettings:Secret"];
        var creds = new SigningCredentials(
            new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey.ToString())),
            SecurityAlgorithms.HmacSha256
        );

        /* 2- Map claims using the properties from Users */
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.User_Id.ToString()),
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role.RoleName)
        };

        /* 3- Read token expiration time (60min) */
        var minutes = double.Parse(_config["JwtSettings:DurationInMinutes"] ?? "60");
        var expiration = DateTime.UtcNow.AddMinutes(minutes);

        /* 4- Creates JWT constructor ussing configurations from appsettings.json */
        var token = new JwtSecurityToken(
            _config["JwtSettings:Issuer"], /* CinemaApi */
            _config["JwtSettings:Audience"], /* CinemaClient */
            claims,
            expires: expiration,
            signingCredentials: creds
        );

        /* 5- Serialize at string to the clientLayer */
        return new JwtSecurityTokenHandler().WriteToken(token);
        
    }
}