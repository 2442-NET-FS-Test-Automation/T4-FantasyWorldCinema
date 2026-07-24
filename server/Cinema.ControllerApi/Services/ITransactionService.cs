using Cinema.ControllerApi.DTOs;
using Microsoft.AspNetCore.Mvc;
using Cinema.Data.Entities;

namespace Cinema.ControllerApi.Services;

public interface ITransactionService
{
    public Task<ServiceResult<TransactionResponseDto>> CreateAsync(int userId, CreateTransactionDto requestDto);
    public Task<ServiceResult<TransactionResponseDto>> GetTransactionByIdAsync(int transactionId, int userId);
    public Task ValidateAndExpireTransactionsAsync(int transactionId);
}