using System.Net.Http.Json;
using Cinema.ControllerApi.DTOs;
using Cinema.Data;
using Cinema.Data.Entities;
using FluentAssertions;
using Microsoft.Extensions.DependencyInjection;
using Xunit;

namespace Cinema.Tests.Integration;

[Collection("Cinema API")]
public class SeatsControllerIntegrationTests
{
    private readonly CustomWebApplicationFactory<Program> _factory;
    private readonly HttpClient _client;

    public SeatsControllerIntegrationTests(CustomWebApplicationFactory<Program> factory)
    {
        _factory = factory;
        _client = factory.CreateClient();
    }

    private void SeedTestData(CinemaDbContext db, int testId, out int showtimeId, out int roomId, string mode)
    {
        // Add Room
        var room = new Rooms { RoomName = $"Test Room {testId}" };
        db.Rooms.Add(room);
        db.SaveChanges();
        roomId = room.Room_Id;

        // Add 4 Seats
        var seat1 = new Seats { Room_Id = roomId, Row = 'A', Number = 1 };
        var seat2 = new Seats { Room_Id = roomId, Row = 'A', Number = 2 };
        var seat3 = new Seats { Room_Id = roomId, Row = 'A', Number = 3 };
        var seat4 = new Seats { Room_Id = roomId, Row = 'A', Number = 4 };
        db.Seats.AddRange(seat1, seat2, seat3, seat4);
        db.SaveChanges();

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
            ShowDate = DateOnly.FromDateTime(DateTime.Now),
            StartTime = TimeOnly.FromDateTime(DateTime.Now),
            EndTime = TimeOnly.FromDateTime(DateTime.Now.AddHours(2))
        };
        db.Showtimes.Add(showtime);
        db.SaveChanges();
        showtimeId = showtime.Showtime_Id;

        // Add Transactions according to mode
        if (mode == "Mix")
        {
            var t1 = new Transactions { Showtime_Id = showtimeId, Status = Status.Completed, PurchaseDate = DateTime.Now, TotalAmount = 10, User_Id = 1, RowVersion = new byte[8] };
            db.Transactions.Add(t1);
            db.SaveChanges();
            db.TransactionSeats.AddRange(
                new TransactionSeats { Transaction_Id = t1.Transaction_Id, Seat_Id = seat2.Seat_Id, RowVersion = new byte[8] },
                new TransactionSeats { Transaction_Id = t1.Transaction_Id, Seat_Id = seat3.Seat_Id, RowVersion = new byte[8] }
            );
        }
        else if (mode == "Full")
        {
            var t1 = new Transactions { Showtime_Id = showtimeId, Status = Status.Completed, PurchaseDate = DateTime.Now, TotalAmount = 40, User_Id = 1, RowVersion = new byte[8] };
            db.Transactions.Add(t1);
            db.SaveChanges();
            db.TransactionSeats.AddRange(
                new TransactionSeats { Transaction_Id = t1.Transaction_Id, Seat_Id = seat1.Seat_Id, RowVersion = new byte[8] },
                new TransactionSeats { Transaction_Id = t1.Transaction_Id, Seat_Id = seat2.Seat_Id, RowVersion = new byte[8] },
                new TransactionSeats { Transaction_Id = t1.Transaction_Id, Seat_Id = seat3.Seat_Id, RowVersion = new byte[8] },
                new TransactionSeats { Transaction_Id = t1.Transaction_Id, Seat_Id = seat4.Seat_Id, RowVersion = new byte[8] }
            );
        }
        // "Empty" means no transactions
        
        db.SaveChanges();
    }

    [Fact]
    public async Task TC12_GetSeats_WithMixOfBookedAndAvailable_Returns200AndMappedSeats()
    {
        // Arrange
        using var scope = _factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<CinemaDbContext>();
        
        SeedTestData(db, 12, out int showtimeId, out int roomId, "Mix");

        // Act
        var response = await _client.GetAsync($"/api/seats/{showtimeId}?Room_Id={roomId}");

        // Assert
        response.EnsureSuccessStatusCode(); // Returns 200 OK
        var seats = await response.Content.ReadFromJsonAsync<List<SeatsDTO>>();

        seats.Should().NotBeNull();
        seats.Should().HaveCount(4);

        // seat2 and seat3 are occupied (1)
        seats!.Single(s => s.Number == "1").IsFree.Should().Be(0);
        seats.Single(s => s.Number == "2").IsFree.Should().Be(1);
        seats.Single(s => s.Number == "3").IsFree.Should().Be(1);
        seats.Single(s => s.Number == "4").IsFree.Should().Be(0);
    }

    [Fact]
    public async Task TC24_GetSeats_WhenCinemaIsCompletelyFull_Returns200AndAllOccupied()
    {
        // Arrange
        using var scope = _factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<CinemaDbContext>();
        
        SeedTestData(db, 24, out int showtimeId, out int roomId, "Full");

        // Act
        var response = await _client.GetAsync($"/api/seats/{showtimeId}?Room_Id={roomId}");

        // Assert
        response.EnsureSuccessStatusCode(); // Returns 200 OK
        var seats = await response.Content.ReadFromJsonAsync<List<SeatsDTO>>();

        seats.Should().NotBeNull();
        seats.Should().HaveCount(4);

        // all seats are occupied (1)
        seats!.All(s => s.IsFree == 1).Should().BeTrue();
    }

    [Fact]
    public async Task TC25_GetSeats_WhenCinemaIsCompletelyEmpty_Returns200AndAllAvailable()
    {
        // Arrange
        using var scope = _factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<CinemaDbContext>();
        
        SeedTestData(db, 25, out int showtimeId, out int roomId, "Empty");

        // Act
        var response = await _client.GetAsync($"/api/seats/{showtimeId}?Room_Id={roomId}");

        // Assert
        response.EnsureSuccessStatusCode(); // Returns 200 OK
        var seats = await response.Content.ReadFromJsonAsync<List<SeatsDTO>>();

        seats.Should().NotBeNull();
        seats.Should().HaveCount(4);

        // all seats are available (0)
        seats!.All(s => s.IsFree == 0).Should().BeTrue();
    }
}
