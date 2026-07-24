using Cinema.Data;
using Cinema.Data.Entities;
using Cinema.ControllerApi.DTOs;

using Microsoft.EntityFrameworkCore;

namespace Cinema.ControllerApi.Services;

public class UserService : IUserService
{
    private readonly CinemaDbContext _db;
    private readonly IArgon2Hasher _passwordHasher;


    public const int ROLE_ADMIN = 1;
    public const int ROLE_CONSUMER = 2;


    public UserService(CinemaDbContext db, IArgon2Hasher passwordHasher)
    {
        _db = db;
        _passwordHasher = passwordHasher;
    }

    public async Task<Users?> LoginAsync(string identifier, string password)
    {
        /* 1. Search users by u.Username == dto.Identifier o u.Email == dto.Identifier. */
        Users? user = await _db.Users
            .Include(u => u.Role)
            .FirstOrDefaultAsync(u => u.Username == identifier || u.Email == identifier);

        if (user == null) { return null; }

        bool isExactUsername = string.Equals(user.Username, identifier, StringComparison.Ordinal);
        bool isExactEmail = string.Equals(user.Email, identifier, StringComparison.Ordinal);
        if ( identifier.Contains('@') ? !isExactEmail : !isExactUsername ) { return null; }

        /* 2- Verifies Hash of the password with the Argon2 Tool */
        bool isValid = _passwordHasher.VerifyPassword(password, user.PasswordHash);
        if (!isValid) { return null; }

        return user;
    }

    public async Task<Users> RegisterAsync(RegisterDto dto)
    {
        /* 1- Verify if Username or Email already exist in DB */
        bool exists = await _db.Users.AnyAsync(u => u.Username == dto.Username || u.Email == dto.Email);
        if (exists) throw new InvalidOperationException("Username or Email already in use");

        /* 2- Hash password using Argon2 Services */
        string hashedPassword = _passwordHasher.HashPassword(dto.Password);

        /* 3- Create User entity with maped DTO */
        var newUser = new Users
        {
            Username = dto.Username,
            Email = dto.Email,
            PasswordHash = hashedPassword,
            FullName = dto.FullName,
            Role_Id =  ROLE_CONSUMER, // targetRole.Role_Id = 2 
            CreatedAt = DateTime.UtcNow
        };

        /* 4- Save new user into DB */
        _db.Users.Add(newUser);
        await _db.SaveChangesAsync();
        return newUser;
    }

}

