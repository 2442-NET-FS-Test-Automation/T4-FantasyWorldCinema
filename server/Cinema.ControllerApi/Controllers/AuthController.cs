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
    public AuthController (IUserService userService, ITokenService tokenService)
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

}
