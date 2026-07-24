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
        CinemaDbContext db = await _factory.CreateDbContextAsync();

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
        CinemaDbContext db = await _factory.CreateDbContextAsync();

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
        CinemaDbContext db = await _factory.CreateDbContextAsync();

        return await db.Transactions
            .FindAsync(transactionId);
    }

    public async Task SetTransactionStatus(int transactionId)
    {
        CinemaDbContext db = await _factory.CreateDbContextAsync();

        await db.Transactions
            .Where(t => t.Transaction_Id == transactionId)
            .ExecuteUpdateAsync(s => s.SetProperty(t => t.Status, Status.Expired));
    }
}