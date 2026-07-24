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


    /// <summary>
    /// -Checks if the selected seats corresponds to the selected showtime.
    /// -Makes a query that fetch all transactions and transactions seats that are 
    /// related to the showtime and if those transactions have an invalid status.
    /// </summary>
    /// <param name="showtimeId"></param>
    /// <param name="seatIds"></param>
    /// <returns>A boolean meaning if at leats one seat is occuppied.</returns>
    public async Task<bool> AreSeatsOccupiedAsync(int showtimeId, List<int> seatIds)
    {   
        CinemaDbContext db = await _factory.CreateDbContextAsync();

        int validSeatsCount = await db.Showtimes
            .Where(s => s.Showtime_Id == showtimeId)
            .Join(db.Rooms, s => s.Room_Id, r => r.Room_Id, (s, r) => r)
            .Join(db.Seats, r => r.Room_Id, st => st.Room_Id, (r, st) => st)
            .CountAsync(st => seatIds.Contains(st.Seat_Id));

        bool validSeats = validSeatsCount == seatIds.Count;
        if (validSeats)
        {
            Status[] unavailableStatuses = [Status.Pending, Status.Completed, Status.Used];

            bool unavailable = await db.Transactions
                .Where(t => t.Showtime_Id == showtimeId && unavailableStatuses.Contains(t.Status))
                .Join(db.TransactionSeats, t => t.Transaction_Id, ts => ts.Transaction_Id, (t, ts) => ts)
                .AnyAsync(ts => seatIds.Contains(ts.Seat_Id));

            return unavailable;
        }

        return true;
    }
}