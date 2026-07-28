using Cinema.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace Cinema.Data;

public class CinemaRepository : ICinemaRepository
{
    private readonly IDbContextFactory<CinemaDbContext> _factory;

    public CinemaRepository(IDbContextFactory<CinemaDbContext> factory)
    {
        _factory = factory;
    }


    public async Task<IReadOnlyList<Cinemas>> GetCinemasAsync()
    {
        CinemaDbContext db = await _factory.CreateDbContextAsync();
        return await db.Cinemas.ToListAsync();
    }

    public async Task<IReadOnlyList<Cinemas>> GetCinemasByMovieAsync(int Movie_Id)
    {
        CinemaDbContext db = await _factory.CreateDbContextAsync();
        IReadOnlyList<int> Cinemas_Ids = await db.Showtimes
            .Include(s => s.Room)
            .Where(s => s.Movie_Id == Movie_Id)
            .Select(s => s.Room.Cinema_Id).ToListAsync();
        
        return await db.Cinemas
            .Where(c => Cinemas_Ids.Contains(c.Cinema_Id))
            .ToListAsync();
    }
}