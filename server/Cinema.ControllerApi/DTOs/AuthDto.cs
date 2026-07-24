using System.ComponentModel.DataAnnotations;
namespace Cinema.ControllerApi.DTOs;

public record RegisterDto(
    [Required, StringLength(255, ErrorMessage = "The full name cannot exceed 255 characters.")]
    string FullName,
    
    [Required, StringLength(50, MinimumLength = 3, ErrorMessage = "The username must be between 3 and 50 characters long.")]
    [RegularExpression(@"^[a-zA-Z0-9]+$", ErrorMessage = "The username can only contain letters and numbers.")]
    string Username,

    [Required, EmailAddress(ErrorMessage = "The email format is invalid.")]
    [StringLength(150, ErrorMessage = "The email cannot exceed 150 characters.")]
    string Email,
    
    [Required, StringLength(100, MinimumLength = 8, ErrorMessage = "The password must be between 8 and 100 characters long.")]
    string Password
);

public record LoginDto(
    [Required(ErrorMessage = "Username or email is required.")]
    [StringLength(150, ErrorMessage = "Identifier cannot exceed 150 characters.")]
    string Identifier,
    
    [Required(ErrorMessage = "Password is required.")]
    [StringLength(100, MinimumLength = 8, ErrorMessage = "The password must be between 8 and 100 characters long.")]
    string Password
);