using AutoMapper;
using FluentAssertions;
using Cinema.ControllerApi.Services;
using Cinema.Data.Entities;
using Cinema.Tests.Unit.Fixtures;
using Microsoft.AspNetCore.Mvc;
using Cinema.ControllerApi.DTOs;
using Moq;
using Cinema.ControllerApi.Controllers;

namespace Cinema.Tests.Unit;

public class AuthControllerTests
{
    private readonly Mock<IUserService> _userService = new();
    private readonly Mock<ITokenService> _tokenService = new();

    private AuthController CreateSut() =>
        new(_userService.Object, _tokenService.Object);


    /* *********************************************************************************************** */
    /* *********************************************************************************************** */

    [Theory]
    [InlineData("Francesco Totti", "Fran34J", "Fran@mail.com", "mysuperPass#3")]
    public async Task TC01_Register_WithValidData_ReturnsOk(string fullname, string username, string email, string password)
    {
        // Given
        RegisterDto registerDto = new(fullname, username, email, password);
        Users mockUser = new();

        _userService.Setup(s => s.RegisterAsync(registerDto)).ReturnsAsync(mockUser);

        AuthController sut = CreateSut();

        // When
        IActionResult result = await sut.Register(registerDto);

        // Then
        var ok = result.Should().BeOfType<OkObjectResult>().Subject;
        ok.StatusCode.Should().Be(200);

        ok.Value.Should().BeEquivalentTo(new { message = "User registered successfully!" });
    }

    /* *********************************************************************************************** */
    /* *********************************************************************************************** */

    [Theory]
    [InlineData("Francesco Totti", "Fran34J", "Fran@mail.com", "mysuperPass#3")]
    public async Task TC02_Register_WithUsedData_ReturnsBadRequest(string fullname, string username, string email, string password)
    {
        // Given
        RegisterDto registerDto = new(fullname, username, email, password);
        string errorMessage = "User already exists";

        _userService.Setup(s => s.RegisterAsync(registerDto)).ThrowsAsync(new InvalidOperationException(errorMessage));

        AuthController sut = CreateSut();

        // When
        IActionResult result = await sut.Register(registerDto);

        // Then
        var ok = result.Should().BeOfType<BadRequestObjectResult>().Subject;
        ok.StatusCode.Should().Be(400);

        ok.Value.Should().NotBeEquivalentTo(new { message = "User registered successfully!" });
        ok.Value.Should().BeEquivalentTo(new { message = errorMessage });
    }


    [Theory]
    [InlineData("Francesco Totti", "Fran34J", "Fran@mail.com", "mysuperPass#3")]
    public async Task TC02_Register_WithUsedData_ReturnsInternalServerError(string fullname, string username, string email, string password)
    {
        // Given
        RegisterDto registerDto = new(fullname, username, email, password);
        string errorMessage = "An error occurred while processing your request.";

        _userService.Setup(s => s.RegisterAsync(registerDto)).ThrowsAsync(new Exception(errorMessage));

        AuthController sut = CreateSut();

        // When
        IActionResult result = await sut.Register(registerDto);

        // Then
        var ok = result.Should().BeOfType<ObjectResult>().Subject;
        ok.StatusCode.Should().Be(500);

        ok.Value.Should().NotBeEquivalentTo(new { message = "User registered successfully!" });
        ok.Value.Should().BeEquivalentTo(new { message = errorMessage });
    }

    /* *********************************************************************************************** */
    /* *********************************************************************************************** */

    [Fact]
    public async Task TC03_Register_WithEmptyPassword_ReturnsBadRequest()
    {
        // Given
        RegisterDto registerDto = new("Francesco Totti", "Fran34J", "Fran@mail.com", "");
        string errorMessage = "Password is required.";

        _userService.Setup(s => s.RegisterAsync(It.IsAny<RegisterDto>()))
                    .ThrowsAsync(new ArgumentException(errorMessage));

        AuthController sut = CreateSut();

        // When
        IActionResult result = await sut.Register(registerDto);

        // Then
        var badRequest = result.Should().BeOfType<BadRequestObjectResult>().Subject;
        badRequest.StatusCode.Should().Be(400);

        badRequest.Value.Should().BeEquivalentTo(new { message = errorMessage });
    }

    /* *********************************************************************************************** */
    /* *********************************************************************************************** */

    [Theory]
    [InlineData("Fran@mail.com", "mysuperPass#3")]
    [InlineData("Fran34J", "mysuperPass#3")]
    public async Task TC04_Login_WithValidCredentials_ReturnsOkWithToken(string identifier, string password)
    {
        // Given
        LoginDto loginDto = new(identifier, password);
        Users mockUser = new();

        _userService.Setup(s => s.LoginAsync(loginDto.Identifier, loginDto.Password)).ReturnsAsync(mockUser);
        _tokenService.Setup(t => t.Issue(mockUser)).Returns("fake_token_jwt_123");

        AuthController sut = CreateSut();

        // When
        IActionResult result = await sut.Login(loginDto);

        // Then
        var ok = result.Should().BeOfType<OkObjectResult>().Subject;
        ok.StatusCode.Should().Be(200);

        _userService.Verify(s => s.LoginAsync(loginDto.Identifier, loginDto.Password), Times.Once);
        _tokenService.Verify(t => t.Issue(mockUser), Times.Once);
    }

    /* *********************************************************************************************** */
    /* *********************************************************************************************** */

    [Theory]
    [InlineData("Fran@mail.com", "WrongPassword")]
    [InlineData("nonexist@mail.com", "mysuperPass#3")]
    [InlineData("badUser", "mysuperPass#3")]
    [InlineData("", "")]
    public async Task TC05_Login_WithInvalidCredentials_ReturnsUnauthorized(string identifier, string password)
    {
        // Given
        LoginDto loginDto = new(identifier, password);

        _userService.Setup(s => s.LoginAsync(loginDto.Identifier, loginDto.Password)).ReturnsAsync((Users?)null);

        AuthController sut = CreateSut();

        // When
        IActionResult result = await sut.Login(loginDto);

        // Then
        var unauthorizedResult = result.Should().BeOfType<UnauthorizedObjectResult>().Subject;
        unauthorizedResult.StatusCode.Should().Be(401);

        _tokenService.Verify(t => t.Issue(It.IsAny<Users>()), Times.Never);
    }

}