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
public class MoviesIntegrationTests : IDisposable
{
    private readonly CustomWebApplicationFactory<Program> _factory;
    private readonly HttpClient _client;

    public MoviesIntegrationTests(CustomWebApplicationFactory<Program> factory)
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
            Username = "movies-admin",
            Email = "movies-admin@test.com",
            PasswordHash = "test-hash",
            Role_Id = 2,
            Role = new Roles { RoleName = "Admin" }
        };

        var client = _factory.CreateClient();
        client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", tokenService.Issue(admin));
        return client;
    }

    private static MovieCreateDto ValidMovie(string title = "Interstellar") =>
        new(title, "Fantasy", 169, "PG13", "A valid synopsis", "poster-url");

    private void SeedTestData(CinemaDbContext db)
    {
        db.Movies.AddRange(
            new Movies
            {
                Movie_Id = 1,
                Title = "Mulan",
                Genre = Genre.Animation,
                DurationMinutes = 120,
                Rating = Rating.G,
                Synopsis = "Synopsis 1",
                PosterUrl = "URL-X"
            },
            new Movies
            {
                Movie_Id = 2,
                Title = "Dune",
                Genre = Genre.Fantasy,
                DurationMinutes = 150,
                Rating = Rating.PG13,
                Synopsis = "Synopsis 2",
                PosterUrl = "URL-X"
            },
            new Movies
            {
                Movie_Id = 3,
                Title = "Titanic",
                Genre = Genre.Comedy,
                DurationMinutes = 180,
                Rating = Rating.R,
                Synopsis = "Synopsis 3",
                PosterUrl = "URL-X"
            }
        );

        db.Rooms.AddRange(
            new Rooms
            {
                Room_Id = 1,
                RoomName = "General 1",
                Cinema_Id = 1,
                Capacity = 25
            },
            new Rooms
            {
                Room_Id = 2,
                RoomName = "General 2",
                Cinema_Id = 1,
                Capacity = 25
            },
            new Rooms
            {
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
    public async Task GetMovies_ReturnsTheCurrentMoviesWithShowtimes()
    {
        // Arrange
        CinemaDbContext db = _factory.Services.CreateScope().ServiceProvider.GetRequiredService<CinemaDbContext>();
        SeedTestData(db);

        // Act
        var response = await _client.GetAsync("api/movies");

        // Assert
        response.StatusCode.Should().Be(System.Net.HttpStatusCode.OK);
        response.Content.Should().NotBeNull();

        var movies = await response.Content.ReadFromJsonAsync<List<MoviesDTO>>();
        movies.Should().HaveCount(2);
        movies.Should().Contain(movies => movies.Title == "Dune");
        movies.Should().Contain(movies => movies.Title == "Titanic");
    }

    [Fact]
    public async Task TC21_AdminCreatesMovie_ReturnsCreatedAndPersistsMovie()
    {
        SeedTestData(_factory.Services.CreateScope().ServiceProvider.GetRequiredService<CinemaDbContext>());
        using var client = CreateAdminClient();

        var response = await client.PostAsJsonAsync("api/movies", ValidMovie());

        response.StatusCode.Should().Be(HttpStatusCode.Created);
        var created = await response.Content.ReadFromJsonAsync<MoviesDTO>();
        created!.Title.Should().Be("Interstellar");

        using var scope = _factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<CinemaDbContext>();
        db.Movies.Should().Contain(movie => movie.Title == "Interstellar");
    }

    [Fact]
    public async Task TC22_AdminUpdatesExistingMovie_ReturnsOkAndPersistsNewValues()
    {
        SeedTestData(_factory.Services.CreateScope().ServiceProvider.GetRequiredService<CinemaDbContext>());
        using var client = CreateAdminClient();
        var update = new MoviesDTO(2, "Dune: Part Two", "Fantasy", "PG13",
            "Updated synopsis", 166, "updated-poster-url");

        var response = await client.PutAsJsonAsync("api/movies", update);

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        using var scope = _factory.Services.CreateScope();
        var movie = scope.ServiceProvider.GetRequiredService<CinemaDbContext>().Movies.Single(m => m.Movie_Id == 2);
        movie.Title.Should().Be("Dune: Part Two");
        movie.DurationMinutes.Should().Be(166);
        movie.Synopsis.Should().Be("Updated synopsis");
    }

    [Fact]
    public async Task TC23_AdminDeletesExistingMovie_ReturnsNoContentAndRemovesMovie()
    {
        SeedTestData(_factory.Services.CreateScope().ServiceProvider.GetRequiredService<CinemaDbContext>());
        using var client = CreateAdminClient();

        var response = await client.DeleteAsync("api/movies?movie_Id=2");

        response.StatusCode.Should().Be(HttpStatusCode.NoContent);
        using var scope = _factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<CinemaDbContext>();
        db.Movies.Should().NotContain(movie => movie.Movie_Id == 2);
    }

    [Fact]
    public async Task TC24_AdminCreatesMovieWithEmptyTitle_ReturnsBadRequestWithTitleValidation()
    {
        using var client = CreateAdminClient();

        var response = await client.PostAsJsonAsync("api/movies", ValidMovie(string.Empty));

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        (await response.Content.ReadAsStringAsync()).Should().Contain("Title");
    }

    [Fact]
    public async Task TC25_AdminUpdatesMovieWithEmptyTitle_ReturnsBadRequestWithTitleValidation()
    {
        using var client = CreateAdminClient();
        var update = new MoviesDTO(1, string.Empty, "Animation", "G", "Synopsis", 120, "poster-url");

        var response = await client.PutAsJsonAsync("api/movies", update);

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        (await response.Content.ReadAsStringAsync()).Should().Contain("Title");
    }

    [Fact]
    public async Task TC26_AdminUpdatesNonExistingMovie_ReturnsBadRequest()
    {
        using var client = CreateAdminClient();

        var response = await client.PutAsJsonAsync("api/movies",
            new MoviesDTO(999, "Missing Movie", "Fantasy", "PG13", "Synopsis", 120, "poster-url"));

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task TC27_AdminDeletesNonExistingMovie_ReturnsNotFound()
    {
        using var client = CreateAdminClient();

        var response = await client.DeleteAsync("api/movies?movie_Id=999");

        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }
}