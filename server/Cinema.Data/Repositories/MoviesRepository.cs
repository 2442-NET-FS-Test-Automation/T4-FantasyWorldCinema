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

    public async Task<Movies> SetMoviesAsync(string title, Genre genre, 
        int durationMinutes, Rating rating, string synopsis, string poster)
    {
        CinemaDbContext db = await _factory.CreateDbContextAsync();
        Movies newMovie = new Movies
        {
            Title = title,
            Genre = genre,
            DurationMinutes = durationMinutes,
            Rating = rating,
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

    public async Task<Movies?> UpdateMovieAsync(int movie_Id, string title, Genre genre, 
        int durationMinutes, Rating rating, string synopsis, string poster)
    {
        CinemaDbContext db = await _factory.CreateDbContextAsync();

        Movies? data = await db.Movies.FirstOrDefaultAsync(m => m.Movie_Id == movie_Id);
        if(data == null) return null;

        data.Title = title;
        data.Genre = genre;
        data.Rating = rating;
        data.DurationMinutes = durationMinutes;
        data.Synopsis = synopsis;
        data.PosterUrl = poster;

        db.SaveChanges();

        return data;

    }

    public async Task<bool> RemoveMovieAsync(int movie_Id)
    {
        CinemaDbContext db = await _factory.CreateDbContextAsync();

        Movies? toDelete = await db.Movies.FirstOrDefaultAsync(m => m.Movie_Id == movie_Id);
        if(toDelete == null) return false;

        db.Movies.Remove(toDelete);
        await db.SaveChangesAsync();
        return true; 
    }
}