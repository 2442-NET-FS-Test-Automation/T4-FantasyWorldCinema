using Cinema.Data.Entities;

namespace Cinema.Data;

public interface ITransactionRepository
{
    public Task<Transactions> CreateTransactionAsync(Transactions transactions);
    public Task<Transactions?> GetTransactionWithDetailsAsync(int transactionId);
    public Task<Transactions?> GetTransactionAsync(int transactionId);
    public Task SetTransactionStatus(int transactionId); 
}