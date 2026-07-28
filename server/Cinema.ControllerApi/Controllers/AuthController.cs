using Cinema.ControllerApi.DTOs;
using Cinema.ControllerApi.Services;
using Cinema.Data;
using Cinema.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Cinema.ControllerApi.Controllers;


[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly ITokenService _tokenService;

    /* Add services for inject to the Authentication */
    public AuthController(IUserService userService, ITokenService tokenService)
    {
        _userService = userService;
        _tokenService = tokenService;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto dto)
    {
        /* 1- Delegate user validation to the UserService */
        Users? user = await _userService.LoginAsync(dto.Identifier, dto.Password);

        if (user == null)
        {
            return Unauthorized(new { message = "Wrong Credentials" });
        }

        /* 2- Generate JWT token using tokenService */
        string token = _tokenService.Issue(user);

        /* 3- Retuns the token to the client */
        return Ok(new { token = token });
    }


    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterDto dto)
    {
        try
        {
            /* Call to UserService to process the new registry */
            await _userService.RegisterAsync(dto);

            return Ok(new { message = "User registered successfully!" });
        }
        catch (InvalidOperationException ex)
        {
            /* Lets manage declared errors */
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception)
        {
            /* Catch unexpected errors from system */
            return StatusCode(500, new { message = "An error occurred while processing your request." });
        }
    }


    [HttpGet("profile/{username}")]
    public async Task<IActionResult> GetProfile(string username)
    {
        Users? user = await _userService.GetByUsernameAsync(username);

        if (user == null)
        {
            return NotFound(new { message = "User not found" });
        }

        return Ok(new
        {
            username = user.Username,
            email = user.Email,
            fullName = user.FullName,
            role_Id = user.Role_Id,
            createdAt = user.CreatedAt.ToString("o") // Format ISO to JS
        });
    }

    [HttpPut("profile/{username}")]
    public async Task<IActionResult> UpdateProfile(string username, [FromBody] UpdateProfileDto dto)
    {
        try
        {
            bool success = await _userService.UpdateProfileAsync(username, dto);

            if (!success) return NotFound(new { message = "User not found" });

            return Ok(new { message = "Profile updated successfully!" });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception)
        {
            return StatusCode(500, new { message = "An error occurred while saving." });
        }
    }

}
