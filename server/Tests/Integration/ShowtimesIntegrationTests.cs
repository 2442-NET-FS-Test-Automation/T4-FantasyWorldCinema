using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using Cinema.ControllerApi.DTOs;
using Cinema.ControllerApi.Services;
using Cinema.Data;
using Cinema.Data.Entities;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;

namespace Cinema.Tests.Integration;

[Collection("Cinema API")]
public class ShowtimesIntegrationTests : IDisposable
{
    private readonly CustomWebApplicationFactory<Program> _factory;
    private readonly HttpClient _client;

    public ShowtimesIntegrationTests(CustomWebApplicationFactory<Program> factory)
    {
        _factory = factory;
        _client = _factory.CreateClient();
    }

    public void Dispose()
    {
        _factory.ResetDatabase();
    }

    private HttpClient CreateAdminClient()
    {
        using var scope = _factory.Services.CreateScope();
        var tokenService = scope.ServiceProvider.GetRequiredService<ITokenService>();
        var admin = new Users
        {
            User_Id = 99,
            Username = "showtimes-admin",
            Email = "showtimes-admin@test.com",
            PasswordHash = "test-hash",
            Role_Id = 2,
            Role = new Roles { RoleName = "Admin" }
        };

        var client = _factory.CreateClient();
        client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", tokenService.Issue(admin));
        return client;
    }

    private void SeedTestData(CinemaDbContext db)
    {
        db.Movies.AddRange(
            new Movies {
                Movie_Id = 1,
                Title = "Mulan",
                Genre = Genre.Animation,
                DurationMinutes = 120,
                Rating = Rating.G,
                Synopsis = "Synopsis 1",
                PosterUrl = "URL-X"
            },
            new Movies {
                Movie_Id = 2,
                Title = "Dune",
                Genre = Genre.Fantasy,
                DurationMinutes = 150,
                Rating = Rating.PG13,
                Synopsis = "Synopsis 2",
                PosterUrl = "URL-X"
            },
            new Movies {
                Movie_Id = 3,
                Title = "Titanic",
                Genre = Genre.Comedy,
                DurationMinutes = 180,
                Rating = Rating.R,
                Synopsis = "Synopsis 3",
                PosterUrl = "URL-X"
            }
        );

        db.Cinemas.AddRange( 
            new Cinemas{
                Cinema_Id = 1,
                CinemaName = "Guadalajara",
                Address = "Hidalgo #1",
                City = City.Guadalajara
            }, 
            new Cinemas{
                Cinema_Id = 2,
                CinemaName = "Tijuana",
                Address = "Juarez #2",
                City = City.Tijuana
            }
        );

        db.Rooms.AddRange(
            new Rooms{
                    Room_Id = 1,
                    RoomName = "General 1",
                    Cinema_Id = 1,
                    Capacity = 25
            },
            new Rooms{
                    Room_Id = 2,
                    RoomName = "General 2",
                    Cinema_Id = 1,
                    Capacity = 25
            },
            new Rooms{
                    Room_Id = 3,
                    RoomName = "IMAX",
                    Cinema_Id = 1,
                    Capacity = 25
            }
        );

        db.Showtimes.AddRange(
            new Showtimes
            {
                Showtime_Id = 1,
                Movie_Id = 1,
                Room_Id = 1,
                ShowDate = DateOnly.FromDateTime(DateTime.Now).AddDays(-1),
                StartTime = new TimeOnly(20, 45),
                EndTime = new TimeOnly(23, 0),
                Price = 4.9m
            },

            new Showtimes
            {
                Showtime_Id = 2,
                Movie_Id = 2,
                Room_Id = 1,
                ShowDate = DateOnly.FromDateTime(DateTime.Now).AddDays(1),
                StartTime = new TimeOnly(20, 45),
                EndTime = new TimeOnly(23, 0),
                Price = 4.9m
            },

            new Showtimes
            {
                Showtime_Id = 3,
                Movie_Id = 3,
                Room_Id = 1,
                ShowDate = DateOnly.FromDateTime(DateTime.Now).AddDays(1),
                StartTime = new TimeOnly(20, 45),
                EndTime = new TimeOnly(23, 0),
                Price = 4.9m
            }
        );


        db.SaveChanges();
    }

    [Fact]
    public async Task GetShowtimeByCinema_ReturnsOkWithCorrectShowtimes()
    {
        
        // Arrange
        using CinemaDbContext db = _factory.Services.CreateScope().ServiceProvider.GetRequiredService<CinemaDbContext>();
        SeedTestData(db);
    
        // Act
        var response = await _client.GetAsync("api/showtime/cinema-1");
    
        // Assert
        response.StatusCode.Should().Be(System.Net.HttpStatusCode.OK);
        response.Content.Should().NotBeNull();

        var showtimes = await response.Content.ReadFromJsonAsync<List<ShowtimeDto>>();
        showtimes.Should().HaveCount(2);
        showtimes.Should().Contain(s => s.Movie == "Dune");
        showtimes.Should().Contain(s => s.Movie == "Titanic");

    }

    [Fact]
    public async Task GetShowtimeByCinema_ReturnsNotFoundWithUnexistingCinema()
    {
        
        // Arrange
        using CinemaDbContext db = _factory.Services.CreateScope().ServiceProvider.GetRequiredService<CinemaDbContext>();
        SeedTestData(db);
    
        // Act
        var response = await _client.GetAsync("api/showtime/cinema-10");
    
        // Assert
        response.StatusCode.Should().Be(System.Net.HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task TC21_AdminCreatesShowtime_ReturnsCreatedAndPersistsShowtime()
    {
        using var scope = _factory.Services.CreateScope();
        SeedTestData(scope.ServiceProvider.GetRequiredService<CinemaDbContext>());
        using var client = CreateAdminClient();
        var request = new ShowtimeCreateDto(1, 2, "2030-08-20", "18:00", "20:00", 7.5m);

        var response = await client.PostAsJsonAsync("api/showtime", request);

        response.StatusCode.Should().Be(HttpStatusCode.Created);
        using var verifyScope = _factory.Services.CreateScope();
        var db = verifyScope.ServiceProvider.GetRequiredService<CinemaDbContext>();
        db.Showtimes.Should().Contain(showtime =>
            showtime.Movie_Id == 1 && showtime.Room_Id == 2 && showtime.Price == 7.5m);
    }

    [Fact]
    public async Task TC22_AdminUpdatesExistingShowtime_ReturnsOkAndPersistsNewValues()
    {
        using var scope = _factory.Services.CreateScope();
        SeedTestData(scope.ServiceProvider.GetRequiredService<CinemaDbContext>());
        using var client = CreateAdminClient();
        var request = new ShowtimeUpdateDto(2, 3, 3, "2030-08-21", "19:00", "22:00", 9.5m);

        var response = await client.PutAsJsonAsync("api/showtime", request);

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        using var verifyScope = _factory.Services.CreateScope();
        var showtime = verifyScope.ServiceProvider.GetRequiredService<CinemaDbContext>()
            .Showtimes.Single(item => item.Showtime_Id == 2);
        showtime.Movie_Id.Should().Be(3);
        showtime.Room_Id.Should().Be(3);
        showtime.Price.Should().Be(9.5m);
    }

    [Fact]
    public async Task TC23_AdminDeletesExistingShowtime_ReturnsNoContentAndRemovesShowtime()
    {
        using var scope = _factory.Services.CreateScope();
        SeedTestData(scope.ServiceProvider.GetRequiredService<CinemaDbContext>());
        using var client = CreateAdminClient();

        var response = await client.DeleteAsync("api/showtime/2");

        response.StatusCode.Should().Be(HttpStatusCode.NoContent);
        using var verifyScope = _factory.Services.CreateScope();
        verifyScope.ServiceProvider.GetRequiredService<CinemaDbContext>().Showtimes
            .Should().NotContain(showtime => showtime.Showtime_Id == 2);
    }

    [Fact]
    public async Task TC24_AdminUpdatesNonExistingShowtime_ReturnsNotFound()
    {
        using var client = CreateAdminClient();
        var request = new ShowtimeUpdateDto(999, 1, 1, "2030-08-20", "18:00", "20:00", 7.5m);

        var response = await client.PutAsJsonAsync("api/showtime", request);

        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task TC25_AdminDeletesNonExistingShowtime_ReturnsNotFound()
    {
        using var client = CreateAdminClient();

        var response = await client.DeleteAsync("api/showtime/999");

        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }
}