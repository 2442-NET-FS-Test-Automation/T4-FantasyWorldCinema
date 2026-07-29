using Microsoft.EntityFrameworkCore;
using Cinema.Data.Entities;

namespace Cinema.Data;

public class TransactionRepository : ITransactionRepository
{
    private readonly IDbContextFactory<CinemaDbContext> _factory;

    public TransactionRepository(IDbContextFactory<CinemaDbContext> factory)
    {
        _factory = factory;
    }

    /// <summary>
    /// -Saves the transaction into the database.
    /// </summary>
    /// <param name="transactions"></param>
    /// <returns>The transaction</returns>
    public async Task<Transactions> CreateTransactionAsync(Transactions transactions)
    {
        await using CinemaDbContext db = await _factory.CreateDbContextAsync();

        await db.Transactions.AddAsync(transactions);
        await db.SaveChangesAsync();

        return transactions;
    }

    /// <summary>
    /// -Makes a query to bring all transaction related data.
    /// </summary>
    /// <param name="transactionId"></param>
    /// <returns>The transaction entity with other entities attached.</returns>
    public async Task<Transactions?> GetTransactionWithDetailsAsync(int transactionId)
    {
        await using CinemaDbContext db = await _factory.CreateDbContextAsync();

        return await db.Transactions
            .Include(t => t.Showtime)
                .ThenInclude(s => s.Movie)
            .Include(t => t.Showtime)
                .ThenInclude(s => s.Room)
                    .ThenInclude(r => r.Cinema)
            .Include(t => t.TransactionSeats)
                .ThenInclude(ts => ts.Seat)
            .FirstOrDefaultAsync(t => t.Transaction_Id == transactionId);
    }

    /// <summary>
    /// Get a transaction by id.
    /// </summary>
    /// <param name="transactionId"></param>
    /// <returns>A transaction</returns>
    public async Task<Transactions?> GetTransactionAsync(int transactionId)
    {
        await using CinemaDbContext db = await _factory.CreateDbContextAsync();

        return await db.Transactions
            .FindAsync(transactionId);
    }

    /// <summary>
    /// Updates transaction status.
    /// </summary>
    /// <param name="transactionId"></param>
    /// <returns></returns>
    public async Task SetTransactionStatus(int transactionId, byte[] currentRowVersion)
    {
        await using CinemaDbContext db = await _factory.CreateDbContextAsync();

        await db.Transactions
            .Where(t => t.Transaction_Id == transactionId && t.RowVersion == currentRowVersion)
            .ExecuteUpdateAsync(s => s.SetProperty(t => t.Status, Status.Expired));
    }

    /// <summary>
    /// Retrieves all transactions of an user and it eagerly loads related movie, room, cinema, and seats.
    /// </summary>
    /// <param name="userId"></param>
    /// <returns>An enumerbale of transactions</returns>
    public async Task<IEnumerable<Transactions>?> GetAllTransactionsByUserAsync(int userId)
    {
        await using CinemaDbContext db = await _factory.CreateDbContextAsync();

        return await db.Transactions
            .Where(t => t.User_Id == userId)
            .Include(t => t.Showtime)
                .ThenInclude(s => s.Movie)
            .Include(t => t.Showtime)
                .ThenInclude(s => s.Room)
                    .ThenInclude(r => r.Cinema)
            .Include(t => t.TransactionSeats)
                .ThenInclude(ts => ts.Seat)
            .AsSplitQuery()
            .ToListAsync();
    }

    public async Task<Transactions?> SetPaidTransaction(int transactionId, int userId)
    {
        await using CinemaDbContext db = await _factory.CreateDbContextAsync();

        Transactions? transaction = await db.Transactions
                                        .Where(t => t.Status == Status.Pending)
                                        .Include(t => t.Showtime)
                                            .ThenInclude(s => s.Movie)
                                        .Include(t => t.Showtime)
                                            .ThenInclude(s => s.Room)
                                                .ThenInclude(r => r.Cinema)
                                        .Include(t => t.TransactionSeats)
                                            .ThenInclude(ts => ts.Seat)
                                        .FirstOrDefaultAsync(t => t.Transaction_Id == transactionId);

        if (transaction is null || transaction.User_Id != userId) return null;
        try
        {
            transaction.Status = Status.Completed;
            await db.SaveChangesAsync();
            return transaction;
        } catch (DbUpdateConcurrencyException)
        {
            return null;
        }
    }
}