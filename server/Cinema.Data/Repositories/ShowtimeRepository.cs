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

    public async Task<IReadOnlyList<Showtimes>> GetAllShowtimesAsync()
    {
        CinemaDbContext db = await _factory.CreateDbContextAsync();
        return await db.Showtimes.ToListAsync();
    }

    public async Task<Showtimes> AddShowtimeAsync(int movie_Id, int room_Id, string showdate, string startTime, string endTime, decimal price)
    {
        CinemaDbContext db = await _factory.CreateDbContextAsync();

        Showtimes newShowtime = new Showtimes
        {
            Movie_Id = movie_Id,
            Room_Id = room_Id,
            ShowDate = DateOnly.Parse(showdate),
            StartTime = TimeOnly.Parse(startTime),
            EndTime = TimeOnly.Parse(endTime),
            Price = price
        };

        db.Showtimes.Add(newShowtime);
        await db.SaveChangesAsync();
        return newShowtime;
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

    public async Task<Showtimes> GetShowtimeById(int Showtime_Id)
    {
        CinemaDbContext db = await _factory.CreateDbContextAsync();
        return await db.Showtimes
            .Include(s => s.Movie)
            .Include(s => s.Room)
            .Where(s => s.Showtime_Id == Showtime_Id)
            .FirstAsync();
    }
}