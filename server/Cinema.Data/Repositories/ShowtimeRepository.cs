using Cinema.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace Cinema.Data;

public class ShowtimeRepository : IShowtimeRepository
{
    private readonly IDbContextFactory<CinemaDbContext> _factory;

    public ShowtimeRepository(IDbContextFactory<CinemaDbContext> factory)
    {
        _factory = factory;
    }

    public async Task<IReadOnlyList<Showtimes>> GetShowtimesByCinemaAsync(int cinema_Id)
    {
        CinemaDbContext db = await _factory.CreateDbContextAsync();
        return await db.Showtimes
            .Include(s => s.Movie) 
            .Include(s => s.Room)
            .Where(s => s.Room.Cinema_Id == cinema_Id && s.ShowDate.ToDateTime(s.EndTime) > DateTime.UtcNow)
            .ToListAsync();
    }
}