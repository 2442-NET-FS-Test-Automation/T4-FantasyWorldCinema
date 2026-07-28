using Cinema.Data.Entities;
using Cinema.ControllerApi.DTOs;

namespace Cinema.ControllerApi.Services;

public interface IUserService
{
    Task<Users?> LoginAsync(string identifier, string password);
    Task<Users> RegisterAsync(RegisterDto dto);
    Task<Users?> GetByUsernameAsync(string username);
    Task<bool> UpdateProfileAsync(string username, UpdateProfileDto dto);
}