using System.Net.Http.Json;
using Cinema.ControllerApi.DTOs;
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
}