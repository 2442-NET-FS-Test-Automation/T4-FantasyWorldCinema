using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using Cinema.ControllerApi.DTOs;
using Cinema.ControllerApi.Services;
using Cinema.Data;
using Cinema.Data.Entities;
using FluentAssertions;
using Microsoft.Extensions.DependencyInjection;
using Xunit;

namespace Cinema.Tests.Integration;

[Collection("Cinema API")]
public class TransactionsControllerIntegrationTests
{
    private readonly CustomWebApplicationFactory<Program> _factory;
    private readonly HttpClient _client;

    public TransactionsControllerIntegrationTests(CustomWebApplicationFactory<Program> factory)
    {
        _factory = factory;
        _client = factory.CreateClient();
    }

    private string GetToken(int userId)
    {
        using var scope = _factory.Services.CreateScope();
        var tokenService = scope.ServiceProvider.GetRequiredService<ITokenService>();
        var user = new Users 
        { 
            User_Id = userId, 
            Username = $"user{userId}", 
            Email = $"test{userId}@test.com", 
            PasswordHash = "hash",
            Role_Id = 1,
            FullName = "Test User",
            Role = new Roles { RoleName = "User" }
        };
        return tokenService.Issue(user);
    }

    private void SeedTestData(CinemaDbContext db, int testId, out int showtimeId, out int roomId, out int seatA1Id, out int seatA2Id)
    {
        // Add Room
        var room = new Rooms { RoomName = $"Test Room {testId}" };
        db.Rooms.Add(room);
        db.SaveChanges();
        roomId = room.Room_Id;

        // Add 2 Seats
        var seat1 = new Seats { Room_Id = roomId, Row = 'A', Number = 1 };
        var seat2 = new Seats { Room_Id = roomId, Row = 'A', Number = 2 };
        db.Seats.AddRange(seat1, seat2);
        db.SaveChanges();
        seatA1Id = seat1.Seat_Id;
        seatA2Id = seat2.Seat_Id;

        // Add Movie
        var movie = new Movies { Title = $"Test Movie {testId}", PosterUrl = "N/A", Synopsis = "N/A" };
        db.Movies.Add(movie);
        db.SaveChanges();

        // Add Showtime
        var showtime = new Showtimes 
        { 
            Movie_Id = movie.Movie_Id, 
            Room_Id = roomId, 
            Price = 10m,
            ShowDate = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1)),
            StartTime = TimeOnly.FromDateTime(DateTime.UtcNow),
            EndTime = TimeOnly.FromDateTime(DateTime.UtcNow.AddHours(2))
        };
        db.Showtimes.Add(showtime);
        db.SaveChanges();
        showtimeId = showtime.Showtime_Id;
    }

    [Fact]
    public async Task TC13_CreateTransaction_WhenSeatAlreadyBooked_ReturnsBadRequest()
    {
        // Arrange
        int userId = 13;
        using var scope = _factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<CinemaDbContext>();
        
        SeedTestData(db, userId, out int showtimeId, out int roomId, out int seatA1Id, out int seatA2Id);

        // Make seatA1 booked
        var previousTransaction = new Transactions 
        { 
            Showtime_Id = showtimeId, 
            Status = Status.Completed, 
            PurchaseDate = DateTime.UtcNow, 
            TotalAmount = 10, 
            User_Id = userId, 
            RowVersion = new byte[8] 
        };
        db.Transactions.Add(previousTransaction);
        db.SaveChanges();
        
        db.TransactionSeats.Add(new TransactionSeats 
        { 
            Transaction_Id = previousTransaction.Transaction_Id, 
            Seat_Id = seatA1Id, 
            RowVersion = new byte[8] 
        });
        db.SaveChanges();

        var token = GetToken(userId);
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        var requestDto = new CreateTransactionDto
        {
            ShowtimeId = showtimeId,
            SeatIds = new List<int> { seatA1Id } // Attempting to book A1 again
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/transactions", requestDto);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        var content = await response.Content.ReadAsStringAsync();
        content.Should().Contain("Selected seats are not valid.");
    }

    [Fact]
    public async Task TC26_CreateTransaction_WhenSeatIsOutOfBounds_ReturnsBadRequest()
    {
        // Arrange
        int userId = 26;
        using var scope = _factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<CinemaDbContext>();
        
        SeedTestData(db, userId, out int showtimeId, out int roomId, out int seatA1Id, out int seatA2Id);

        var token = GetToken(userId);
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        int outOfBoundsSeatId = 99999; // Assume this doesn't exist

        var requestDto = new CreateTransactionDto
        {
            ShowtimeId = showtimeId,
            SeatIds = new List<int> { outOfBoundsSeatId } 
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/transactions", requestDto);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        var content = await response.Content.ReadAsStringAsync();
        content.Should().Contain("Selected seats are not valid.");
    }
}
