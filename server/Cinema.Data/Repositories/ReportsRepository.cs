using Cinema.Data.DTOs;
using Microsoft.EntityFrameworkCore;
using Cinema.Data.Entities;

namespace Cinema.Data;

public class ReportsRepository : IReportsRepository
{

    private readonly IDbContextFactory<CinemaDbContext> _factory;

    public ReportsRepository(IDbContextFactory<CinemaDbContext> factory)
    {
        _factory = factory;
    }

    public async Task<IEnumerable<CinemaRevenueDto>> GetCinemaPerformanceAsync(DateTime startDate, DateTime endDate, CancellationToken cancellationToken = default)
    {
        await using CinemaDbContext db = await _factory.CreateDbContextAsync(cancellationToken);

        return await db.Transactions
            .AsNoTracking()
            .Where(t => t.PurchaseDate >= startDate &&
                        t.PurchaseDate <= endDate &&
                        (t.Status == Status.Completed || t.Status == Status.Used))
            .GroupBy(t => new 
            { 
                t.Showtime.Room.Cinema.Cinema_Id, 
                t.Showtime.Room.Cinema.CinemaName 
            })
            .Select(g => new CinemaRevenueDto(
                g.Key.Cinema_Id,
                g.Key.CinemaName,
                g.Sum(x => x.TotalAmount),
                g.Count()
            ))
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<OccupancyRateDto>> GetOccupancyRatesAsync(DateTime startDate, DateTime endDate, int? cinemaId = null, CancellationToken cancellationToken = default)
    {
        await using CinemaDbContext db = await _factory.CreateDbContextAsync(cancellationToken);

        var rawData = await db.Transactions
            .AsNoTracking()
            .Where(t => t.PurchaseDate >= startDate &&
                        t.PurchaseDate <= endDate &&
                        t.Status == Status.Used &&
                        (!cinemaId.HasValue || t.Showtime.Room.Cinema.Cinema_Id == cinemaId))
            .SelectMany(t => t.TransactionSeats.Select(ts => new
            {
                ShowtimeId = t.Showtime.Showtime_Id,
                MovieTitle = t.Showtime.Movie.Title,
                CinemaName = t.Showtime.Room.Cinema.CinemaName,
                ShowDate = t.Showtime.ShowDate,
                Capacity = t.Showtime.Room.Capacity
            }))
            .GroupBy(x => new
            {
                x.ShowtimeId,
                x.MovieTitle,
                x.CinemaName,
                x.ShowDate,
                x.Capacity
            })
            .Select(g => new 
            {
                g.Key.MovieTitle,
                g.Key.CinemaName,
                g.Key.ShowDate,
                g.Key.Capacity,
                SoldSeats = g.Count()
            })
            .ToListAsync(cancellationToken);

        return rawData
            .Select(x => new OccupancyRateDto(
                x.MovieTitle,
                x.CinemaName,
                x.ShowDate,
                x.Capacity,
                x.SoldSeats,
                Math.Round((double)x.SoldSeats * 100.0 / x.Capacity, 2)
            ))
            .OrderByDescending(x => x.OccupancyPercentage)
            .ToList();
    }

    public async Task<IEnumerable<MovieRevenueDto>> GetTopMoviesByRevenueAsync(DateTime startDate, DateTime endDate, int limit = 10, CancellationToken cancellationToken = default)
    {
        await using CinemaDbContext db = await _factory.CreateDbContextAsync(cancellationToken);

        limit = limit <= 0 ? 10 : limit;
        
        var rawData = await db.Transactions
            .AsNoTracking()
            .Where(t => t.PurchaseDate >= startDate &&
                        t.PurchaseDate <= endDate &&
                        (t.Status == Status.Completed || t.Status == Status.Used))
            .Select(t => new
            {
                MovieTitle = t.Showtime.Movie.Title,
                Amount = t.TotalAmount,
                Tickets = t.TransactionSeats.Count()
            })
            .GroupBy(x => x.MovieTitle)
            .Select(g => new 
            {
                Title = g.Key,
                TotalRevenue = g.Sum(x => x.Amount),
                TotalTickets = g.Sum(x => x.Tickets)
            })
            .OrderByDescending(x => x.TotalRevenue)
            .Take(limit)
            .ToListAsync(cancellationToken);
            
        var result = rawData.Select(x => new MovieRevenueDto(
            x.Title,
            x.TotalRevenue,
            x.TotalTickets
        ));

        return result;
    }

    public async Task<IEnumerable<TransactionStatusSummaryDto>> GetTransactionStatusSummaryAsync(DateTime startDate, DateTime endDate, CancellationToken cancellationToken = default)
    {
        await using CinemaDbContext db = await _factory.CreateDbContextAsync(cancellationToken);

        var rawData = await db.Transactions
            .AsNoTracking()
            .Where(t => t.PurchaseDate >= startDate &&
                        t.PurchaseDate <= endDate)
            .GroupBy(t => t.Status)
            .Select(g => new 
            {
                StatusEnum = g.Key,
                Count = g.Count(),
                TotalAmount = g.Sum(x => x.TotalAmount)
            })
            .ToListAsync(cancellationToken);

        var result = rawData
            .Select(x => new TransactionStatusSummaryDto(
                x.StatusEnum.ToString(),
                x.Count,
                x.TotalAmount
            ))
            .OrderByDescending(dto => dto.Count)
            .ToList();

        return result;
    }

    public async Task<int> GetTotalTicketsSold(DateTime startDate, DateTime endDate)
    {
        await using CinemaDbContext db = await _factory.CreateDbContextAsync();

        return await db.TransactionSeats
            .Where(t => t.Transaction.PurchaseDate >= startDate &&
                        t.Transaction.PurchaseDate <= endDate &&
                        (t.Transaction.Status == Status.Completed || t.Transaction.Status == Status.Used))
            .Select(x => x.TransactionSeat_Id)
            .Distinct()
            .CountAsync();
    }
}