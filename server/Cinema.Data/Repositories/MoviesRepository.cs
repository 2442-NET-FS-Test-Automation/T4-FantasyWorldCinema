using Cinema.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Internal;

namespace Cinema.Data;

public class MoviesRepository : IMoviesRepository
{
    private readonly IDbContextFactory<CinemaDbContext> _factory;

    public MoviesRepository(IDbContextFactory<CinemaDbContext> factory)
    {
        _factory = factory;
    }

    public async Task<IReadOnlyList<Movies>> GetMoviesAsync()
    {
        CinemaDbContext db = await _factory.CreateDbContextAsync();

        return await db.Movies
            .Where(s => s.showtimes.Any( s => 
                s.ShowDate.ToDateTime(s.EndTime) >= DateTime.UtcNow))
            .ToListAsync();
    }

    public async Task<Movies> SetMoviesAsync(string title, string genre, 
        int durationMinutes, string rating, string synopsis, string poster)
    {
        CinemaDbContext db = await _factory.CreateDbContextAsync();
        Enum.TryParse<Genre>(genre, out Genre newGenre);
        Enum.TryParse<Rating>(rating, out Rating newRating);
        Movies newMovie = new Movies
        {
            Title = title,
            Genre = newGenre,
            DurationMinutes = durationMinutes,
            Rating = newRating,
            Synopsis = synopsis,
            PosterUrl = poster
        };

        db.Movies.Add(newMovie);
        await db.SaveChangesAsync();
        return newMovie;
    }

    public async Task<IReadOnlyList<Movies>> GetAllMoviesAsync()
    {
        CinemaDbContext db = await _factory.CreateDbContextAsync();
        return await db.Movies.ToListAsync();
    }
}