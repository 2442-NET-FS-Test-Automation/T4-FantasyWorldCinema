using Cinema.Data.Entities;

namespace Cinema.Data;

public interface ITransactionRepository
{
    public Task<Transactions> CreateTransactionAsync(Transactions transactions);
    public Task<Transactions?> GetTransactionWithDetailsAsync(int transactionId);
}