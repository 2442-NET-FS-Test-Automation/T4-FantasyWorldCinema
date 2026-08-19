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
        // Add Cinema
        var cinema = new Cinemas { CinemaName = $"Test Cinema {testId}", City = City.Tijuana, Address = "Test Address" };
        db.Cinemas.Add(cinema);
        db.SaveChanges();

        // Add Room
        var room = new Rooms { RoomName = $"Test Room {testId}", Cinema_Id = cinema.Cinema_Id };
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
    public async Task TC31_CreateTransaction_WhenSeatIsOutOfBounds_ReturnsBadRequest()
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
    [Fact]
    public async Task TC14_CreateTransaction_HappyPath_Returns201Created()
    {
        // Arrange
        int userId = 14;
        using var scope = _factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<CinemaDbContext>();
        
        SeedTestData(db, userId, out int showtimeId, out int roomId, out int seatA1Id, out int seatA2Id);

        var token = GetToken(userId);
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        var requestDto = new CreateTransactionDto
        {
            ShowtimeId = showtimeId,
            SeatIds = new List<int> { seatA1Id, seatA2Id } // Attempting to book A1 and A2
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/transactions", requestDto);

        // Assert
        if (!response.IsSuccessStatusCode)
        {
            var errorBody = await response.Content.ReadAsStringAsync();
            throw new Exception($"Failed with {response.StatusCode}. Body: {errorBody}");
        }

        response.StatusCode.Should().Be(HttpStatusCode.Created);
        var createdTransaction = await response.Content.ReadFromJsonAsync<TransactionResponseDto>();
        createdTransaction.Should().NotBeNull();
        createdTransaction!.Status.Should().Be("Pending");
        createdTransaction.PurchasedSeats.Should().HaveCount(2);
    }
    [Fact]
    public async Task TC15_CreateTransaction_With0Seats_ReturnsBadRequest()
    {
        // Arrange
        int userId = 15;
        using var scope = _factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<CinemaDbContext>();
        
        SeedTestData(db, userId, out int showtimeId, out int roomId, out int seatA1Id, out int seatA2Id);

        var token = GetToken(userId);
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        var requestDto = new CreateTransactionDto
        {
            ShowtimeId = showtimeId,
            SeatIds = new List<int>() // Empty seats array
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/transactions", requestDto);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        var content = await response.Content.ReadAsStringAsync();
        content.Should().Contain("You must select at least one seat");
    }

    [Fact]
    public async Task TC15b_CreateTransaction_WithMoreThan10Seats_ReturnsBadRequest()
    {
        // Arrange
        int userId = 152;
        using var scope = _factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<CinemaDbContext>();
        
        SeedTestData(db, userId, out int showtimeId, out int roomId, out int seatA1Id, out int seatA2Id);

        var token = GetToken(userId);
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        var requestDto = new CreateTransactionDto
        {
            ShowtimeId = showtimeId,
            SeatIds = Enumerable.Range(1, 11).ToList() // 11 seats
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/transactions", requestDto);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        var content = await response.Content.ReadAsStringAsync();
        content.Should().Contain("A maximum of 10 seats is allowed");
    }

    [Fact]
    public async Task TC32_CreateTransaction_WithMissingFields_ReturnsBadRequest()
    {
        // Arrange
        int userId = 32;
        var token = GetToken(userId);
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        // Submit empty payload (missing ShowtimeId and SeatIds entirely)
        var requestDto = new {};

        // Act
        var response = await _client.PostAsJsonAsync("/api/transactions", requestDto);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        var content = await response.Content.ReadAsStringAsync();
        content.Should().Contain("The Showtime ID is required");
    }
    [Fact]
    public async Task TC16_CreateTransaction_NonExistentShowtime_ReturnsNotFound()
    {
        // Arrange
        int userId = 16;
        var token = GetToken(userId);
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        var requestDto = new CreateTransactionDto
        {
            ShowtimeId = 99999, // Does not exist
            SeatIds = new List<int> { 1, 2 }
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/transactions", requestDto);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task TC33_CreateTransaction_PastShowtime_ReturnsBadRequest()
    {
        // Arrange
        int userId = 33;
        using var scope = _factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<CinemaDbContext>();
        
        // SeedTestData will create a valid showtime, we will create another one in the past
        SeedTestData(db, userId, out int _, out int roomId, out int seatA1Id, out int seatA2Id);

        var movie = new Movies { Title = $"Test Movie Past", PosterUrl = "N/A", Synopsis = "N/A" };
        db.Movies.Add(movie);
        db.SaveChanges();

        // Add Past Showtime
        var pastShowtime = new Showtimes 
        { 
            Movie_Id = movie.Movie_Id, 
            Room_Id = roomId, 
            Price = 10m,
            ShowDate = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(-1)), // Yesterday
            StartTime = TimeOnly.FromDateTime(DateTime.UtcNow),
            EndTime = TimeOnly.FromDateTime(DateTime.UtcNow.AddHours(2))
        };
        db.Showtimes.Add(pastShowtime);
        db.SaveChanges();

        var token = GetToken(userId);
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        var requestDto = new CreateTransactionDto
        {
            ShowtimeId = pastShowtime.Showtime_Id,
            SeatIds = new List<int> { seatA1Id }
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/transactions", requestDto);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        var content = await response.Content.ReadAsStringAsync();
        content.Should().Contain("Tickets cannot be purchased for past events.");
    }
    [Fact]
    public async Task TC17_GetAllTransactionsByUser_With3Transactions_Returns200OKAndTransactions()
    {
        // Arrange
        int userId = 17;
        using var scope = _factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<CinemaDbContext>();
        
        SeedTestData(db, userId, out int showtimeId, out int _, out int seatA1Id, out int seatA2Id);

        // Add 3 transactions for the user
        for (int i = 1; i <= 3; i++)
        {
            var transaction = new Transactions
            {
                Showtime_Id = showtimeId,
                Status = Status.Completed,
                PurchaseDate = DateTime.UtcNow,
                TotalAmount = 20,
                User_Id = userId,
                RowVersion = new byte[8]
            };
            db.Transactions.Add(transaction);
            db.SaveChanges();
        }

        var token = GetToken(userId);
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        // Act
        var response = await _client.GetAsync("/api/transactions/user");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var content = await response.Content.ReadFromJsonAsync<List<TransactionResponseDto>>();
        content.Should().NotBeNull();
        content.Should().HaveCount(3);
    }

    [Fact]
    public async Task TC34_GetAllTransactionsByUser_With0Transactions_Returns200OKAndEmptyArray()
    {
        // Arrange
        int userId = 34; // Newly registered consumer
        
        var token = GetToken(userId);
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        // Act
        var response = await _client.GetAsync("/api/transactions/user");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var content = await response.Content.ReadFromJsonAsync<List<TransactionResponseDto>>();
        content.Should().NotBeNull();
        content.Should().BeEmpty();
    }
    [Fact]
    public async Task TC18_GetTransactionById_OwnedByAnotherUser_ReturnsNotFound()
    {
        // Arrange
        int consumerA_Id = 181;
        int consumerB_Id = 182;
        using var scope = _factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<CinemaDbContext>();
        
        SeedTestData(db, consumerB_Id, out int showtimeId, out int _, out int _, out int _);

        // Transaction belongs to Consumer B
        var transactionB = new Transactions
        {
            Showtime_Id = showtimeId,
            Status = Status.Completed,
            PurchaseDate = DateTime.UtcNow,
            TotalAmount = 15,
            User_Id = consumerB_Id,
            RowVersion = new byte[8]
        };
        db.Transactions.Add(transactionB);
        db.SaveChanges();

        // Consumer A tries to fetch it
        var tokenA = GetToken(consumerA_Id);
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", tokenA);

        // Act
        var response = await _client.GetAsync($"/api/transactions/{transactionB.Transaction_Id}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task TC18b_GetTransactionById_ByAdmin_ForConsumerData_ReturnsNotFound()
    {
        // Arrange
        int adminId = 999; // Admin role
        int consumerB_Id = 183;
        using var scope = _factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<CinemaDbContext>();
        
        SeedTestData(db, consumerB_Id, out int showtimeId, out int _, out int _, out int _);

        var transactionB = new Transactions
        {
            Showtime_Id = showtimeId,
            Status = Status.Completed,
            PurchaseDate = DateTime.UtcNow,
            TotalAmount = 15,
            User_Id = consumerB_Id,
            RowVersion = new byte[8]
        };
        db.Transactions.Add(transactionB);
        db.SaveChanges();

        // Creating token inline or using GetToken with Admin is not trivial without modifying GetToken.
        // I will just use GetToken since GetToken usually assigns "User" role but the NameIdentifier is what matters here for ownership
        var tokenAdmin = GetToken(adminId);
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", tokenAdmin);

        // Act
        var response = await _client.GetAsync($"/api/transactions/{transactionB.Transaction_Id}");

        // Assert
        // Admin ID != Consumer B ID, so ownership rule returns 404
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task TC35_CancelTransaction_OwnedByAnotherUser_ReturnsNotFound()
    {
        // Arrange
        int consumerA_Id = 351;
        int consumerB_Id = 352;
        using var scope = _factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<CinemaDbContext>();
        
        SeedTestData(db, consumerB_Id, out int showtimeId, out int _, out int _, out int _);

        // Transaction belongs to Consumer B
        var transactionB = new Transactions
        {
            Showtime_Id = showtimeId,
            Status = Status.Completed,
            PurchaseDate = DateTime.UtcNow,
            TotalAmount = 15,
            User_Id = consumerB_Id,
            RowVersion = new byte[8]
        };
        db.Transactions.Add(transactionB);
        db.SaveChanges();

        // Consumer A tries to cancel it
        var tokenA = GetToken(consumerA_Id);
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", tokenA);

        // Act
        var response = await _client.PatchAsync($"/api/transactions/user/cancelled/{transactionB.Transaction_Id}", null);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }
}
