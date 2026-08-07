using Cinema.Data.DTOs;
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
            .Where(s => s.Movie_Id == Movie_Id && s.ShowDate.ToDateTime(s.EndTime) > DateTime.UtcNow)
            .Select(s => s.Room.Cinema_Id).ToListAsync();
        
        return await db.Cinemas
            .Where(c => Cinemas_Ids.Contains(c.Cinema_Id))
            .ToListAsync();
    }

    public async Task<IEnumerable<CinemasWithUsedDto>> GetCinemasWithUsedTransactions(DateTime startDate, DateTime endDate)
    {
        await using CinemaDbContext db = await _factory.CreateDbContextAsync();

        var rawData = await db.Transactions
            .Where(t => t.Showtime.ShowDate >= DateOnly.FromDateTime(startDate) &&
                        t.Showtime.ShowDate <= DateOnly.FromDateTime(endDate) &&
                        t.Status == Status.Used)
            .Select(t => new
            {
                t.Showtime.Room.Cinema.Cinema_Id,
                t.Showtime.Room.Cinema.CinemaName
            })
            .Distinct()
            .ToListAsync();

        var result = rawData.Select(x => new CinemasWithUsedDto(
            x.Cinema_Id,
            x.CinemaName
        ));

        return result;
    }

    public async Task<int> GetCinemasWithActiveShowtimes(DateTime startDate, DateTime endDate)
    {
        await using CinemaDbContext db = await _factory.CreateDbContextAsync();

        return await db.Showtimes
            .Where(s => s.ShowDate >= DateOnly.FromDateTime(startDate) &&
                        s.ShowDate <= DateOnly.FromDateTime(endDate))
            .Select(s => s.Room.Cinema.Cinema_Id)
            .Distinct()
            .CountAsync();
    }
}