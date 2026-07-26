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
}