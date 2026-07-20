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
        return await db.Showtimes.Join(db.Rooms, s => s.Room_Id, r => r.Room_Id, (s, r) => new { s, r})
            .Where(re => re.r.Cinema_Id == cinema_Id && re.s.ShowDate.ToDateTime(re.s.EndTime) > DateTime.UtcNow)
            .Select(re => re.s)
            .ToListAsync();
    }
}