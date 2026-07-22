using Microsoft.EntityFrameworkCore;
using Cinema.Data.Entities;
using Cinema.Data;

namespace Cinema.Data;

public class SeatsRepository : ISeatsRepository
{
    private readonly IDbContextFactory<CinemaDbContext> _factory;

    public SeatsRepository(IDbContextFactory<CinemaDbContext> factory)
    {
        _factory = factory;
    }

    public async Task<IReadOnlyList<(int Seat_Id, char Row, int Number, Status LastTransaction)>> 
        GetSeatsByShowtimeAsync(int Showtime_Id, int Room_Id)
    {
        CinemaDbContext db = await _factory.CreateDbContextAsync();

        var queryResult = await db.Seats
            .Where(s => s.Room_Id == Room_Id)
            .Select(s => new
            {
                Seat_Id = s.Seat_Id,
                Row = s.Row,
                Number = s.Number,
                LastTransaction = s.transactionSeats
                    .Where(ts => ts.Seat_Id == s.Seat_Id && ts.Transaction.Showtime_Id == Showtime_Id)
                    .OrderByDescending(ts => ts.Transaction.PurchaseDate)
                    .Select(ts => ts.Transaction.Status)
                    .FirstOrDefault()
                    
            }).ToListAsync();

         return queryResult
            .Select(x => (x.Seat_Id, x.Row, x.Number, x.LastTransaction))
            .ToList();
    }
}