using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using Cinema.ControllerApi.DTOs;
using Cinema.ControllerApi.Services;
using Cinema.Data;
using Cinema.Data.Entities;
using FluentAssertions;
using Microsoft.Extensions.DependencyInjection;

namespace Cinema.Tests.Integration;

[Collection("Cinema API")]
public class AuthControllerIntegrationTests
{
    private readonly CustomWebApplicationFactory<Program> _factory;
    private readonly HttpClient _client;

    public AuthControllerIntegrationTests(CustomWebApplicationFactory<Program> factory)
    {
        _factory = factory;
        _client = factory.CreateClient();
    }

    [Theory]
    [InlineData("GET", "/api/reports/cinema-performance?StartDate=2026-01-01&EndDate=2026-12-31")]
    [InlineData("GET", "/api/reports/total-revenue?StartDate=2026-01-01&EndDate=2026-12-31")]
    [InlineData("GET", "/api/cinema/cinemas-withUsed?StartDate=2026-01-01&EndDate=2026-12-31")]
    [InlineData("POST", "/api/movies")]
    [InlineData("PUT", "/api/movies")]
    [InlineData("DELETE", "/api/movies?movie_Id=1")]
    [InlineData("POST", "/api/showtime")]
    [InlineData("POST", "/api/transactions")]
    [InlineData("GET", "/api/transactions/user/")]
    public async Task TC07_AnonymousUser_AccessingProtectedEndpoints_Returns401Unauthorized(string httpMethod, string requestUrl)
    {
        // Arrange
        HttpRequestMessage request = new(new HttpMethod(httpMethod), requestUrl);

        // Act
        var response = await _client.SendAsync(request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Theory]
    [InlineData("GET", "/api/reports/cinema-performance?StartDate=2026-01-01&EndDate=2026-12-31")]
    [InlineData("GET", "/api/reports/occupancy-rates?StartDate=2026-01-01&EndDate=2026-12-31&CinemaId=1")]
    [InlineData("GET", "/api/reports/top-movies?StartDate=2026-01-01&EndDate=2026-12-31&Limit=5")]
    [InlineData("GET", "/api/reports/transaction-status?StartDate=2026-01-01&EndDate=2026-12-31")]
    [InlineData("GET", "/api/reports/total-tickets-sold?StartDate=2026-01-01&EndDate=2026-12-31")]
    [InlineData("GET", "/api/reports/total-revenue?StartDate=2026-01-01&EndDate=2026-12-31")]
    [InlineData("GET", "/api/cinema/cinemas-withUsed?StartDate=2026-01-01&EndDate=2026-12-31")]
    [InlineData("GET", "/api/cinema/cinemas-withActiveShowtimes?StartDate=2026-01-01&EndDate=2026-12-31")]
    [InlineData("POST", "/api/movies")]
    [InlineData("PUT", "/api/movies")]
    [InlineData("DELETE", "/api/movies?movie_Id=1")]
    [InlineData("POST", "/api/showtime")]
    [InlineData("PUT", "/api/showtime")]
    [InlineData("DELETE", "/api/showtime/1")]
    public async Task TC08_ConsumerUser_AccessingAdminEndpoints_Returns403Forbidden(string httpMethod, string requestUrl)
    {
        // Arrange
        using var scope = _factory.Services.CreateScope();
        var tokenService = scope.ServiceProvider.GetRequiredService<ITokenService>();

        var consumerUser = new Users
        {
            User_Id = 10,
            Username = "consumerTest_user",
            Email = "consumer@test.com",
            PasswordHash = "dummyTest_hash",
            Role_Id = 2,
            Role = new Roles
            {
                Role_Id = 2,
                RoleName = "Consumer"
            }
        };

        string token = tokenService.Issue(consumerUser);

        var request = new HttpRequestMessage(new HttpMethod(httpMethod), requestUrl);
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);

        // Act
        var response = await _client.SendAsync(request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Forbidden, 
        $"An usuer with Consumer role nust not Admin permitions in {httpMethod} {requestUrl}.");
    }

}