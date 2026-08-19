using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using Cinema.ControllerApi.DTOs;
using Cinema.ControllerApi.Services;
using Cinema.Data;
using Cinema.Data.DTOs;
using Cinema.Data.Entities;
using FluentAssertions;
using Microsoft.Extensions.DependencyInjection;
using Xunit;

namespace Cinema.Tests.Integration;

[Collection("Cinema API")]
public class ReportsControllerIntegrationTests : IDisposable
{
    private readonly CustomWebApplicationFactory<Program> _factory;
    private readonly HttpClient _client;

    public ReportsControllerIntegrationTests(CustomWebApplicationFactory<Program> factory)
    {
        _factory = factory;
        _client = factory.CreateClient();
    }

    public void Dispose()
    {
        _factory.ResetDatabase();
    }

    private string GetToken(int userId)
    {
        using var scope = _factory.Services.CreateScope();
        var tokenService = scope.ServiceProvider.GetRequiredService<ITokenService>();
        var user = new Users 
        { 
            User_Id = userId, 
            Username = $"admin{userId}", 
            Email = $"admin{userId}@test.com", 
            PasswordHash = "hash",
            Role_Id = 2,
            FullName = "Admin User",
            Role = new Roles { RoleName = "Admin" }
        };
        return tokenService.Issue(user);
    }

    private void SeedTransactions(CinemaDbContext db, DateTime purchaseDate, Status status)
    {
        var cinema = new Cinemas { CinemaName = "Report Cinema", City = City.Tijuana, Address = "Test" };
        db.Cinemas.Add(cinema);
        db.SaveChanges();
        
        var room = new Rooms { RoomName = "Report Room", Cinema_Id = cinema.Cinema_Id };
        db.Rooms.Add(room);
        db.SaveChanges();

        var movie = new Movies { Title = "Report Movie", PosterUrl = "N/A", Synopsis = "N/A" };
        db.Movies.Add(movie);
        db.SaveChanges();

        var showtime = new Showtimes 
        { 
            Movie_Id = movie.Movie_Id, 
            Room_Id = room.Room_Id, 
            ShowDate = DateOnly.FromDateTime(purchaseDate), 
            StartTime = TimeOnly.FromDateTime(purchaseDate),
            EndTime = TimeOnly.FromDateTime(purchaseDate.AddMinutes(120)),
            Price = 10m 
        };
        db.Showtimes.Add(showtime);
        db.SaveChanges();

        var transaction = new Transactions
        {
            Showtime_Id = showtime.Showtime_Id,
            Status = status,
            PurchaseDate = purchaseDate,
            TotalAmount = 25,
            User_Id = 99,
            RowVersion = new byte[8]
        };
        db.Transactions.Add(transaction);
        db.SaveChanges();
    }

    [Fact]
    public async Task TC28_GetTransactionStatusSummary_ValidRange_Returns200OKAndAggregates()
    {
        // Arrange
        int adminId = 28;
        using var scope = _factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<CinemaDbContext>();
        
        DateTime date = DateTime.UtcNow;
        SeedTransactions(db, date, Status.Pending);
        SeedTransactions(db, date, Status.Completed);
        SeedTransactions(db, date, Status.Cancelled);

        var token = GetToken(adminId);
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        string startDateStr = date.AddDays(-1).ToString("yyyy-MM-dd");
        string endDateStr = date.AddDays(1).ToString("yyyy-MM-dd");

        // Act
        var response = await _client.GetAsync($"/api/reports/transaction-status?startDate={startDateStr}&endDate={endDateStr}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var content = await response.Content.ReadFromJsonAsync<List<TransactionStatusSummaryDto>>();
        content.Should().NotBeNull();
        content.Should().NotBeEmpty();
    }

    [Fact]
    public async Task TC38_GetCinemaPerformance_EmptyRange_Returns200OKAndEmptyArray()
    {
        // Arrange
        int adminId = 38;
        var token = GetToken(adminId);
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        string startDateStr = "2099-01-01";
        string endDateStr = "2099-12-31";

        // Act
        var response = await _client.GetAsync($"/api/reports/cinema-performance?startDate={startDateStr}&endDate={endDateStr}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var content = await response.Content.ReadFromJsonAsync<List<CinemaRevenueDto>>();
        content.Should().NotBeNull();
        content.Should().BeEmpty();
    }

    [Fact]
    public async Task TC39_GetCinemaPerformance_InvertedDates_ReturnsBadRequest()
    {
        // Arrange
        int adminId = 39;
        var token = GetToken(adminId);
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        string startDateStr = "2024-12-31";
        string endDateStr = "2024-01-01"; // Inverted

        // Act
        var response = await _client.GetAsync($"/api/reports/cinema-performance?startDate={startDateStr}&endDate={endDateStr}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        var content = await response.Content.ReadAsStringAsync();
        content.Should().Contain("Invalid date range.");
    }
}
