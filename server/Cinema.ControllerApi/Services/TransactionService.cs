using System.Transactions;
using Cinema.Data;
using Microsoft.AspNetCore.Mvc;
using Cinema.Data.Entities;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using Serilog;
using Hangfire;
namespace Cinema.ControllerApi.Services;

public class TransactionService : ITransactionService
{
    private readonly ITransactionRepository _transactionRepository;
    private readonly ISeatsRepository _seatsRepository;
    private readonly IShowtimeService _showtimeService;
    private readonly IMapper _mapper;
    private readonly IBackgroundJobClient _backgroundJobClient;

    public TransactionService(ITransactionRepository transactionRepo, ISeatsRepository seatsRepo, 
        IShowtimeService showtimeService, IMapper mapper, IBackgroundJobClient backgroundJobClient)
    {
        _transactionRepository = transactionRepo;
        _seatsRepository = seatsRepo;
        _showtimeService = showtimeService;
        _mapper = mapper;
        _backgroundJobClient = backgroundJobClient;
    }
    
    /// <summary>
    /// -Checks if the showtime is valid.
    /// -Ckecks if seats are valid.
    /// -Delegate a creation to the repository.
    /// -Maps the transaction into the responseDto.
    /// </summary>
    /// <param name="userId"></param>
    /// <param name="requestDto"></param>
    /// <returns>A service result with the data of the transaction.</returns>
    public async Task<ServiceResult<TransactionResponseDto>> CreateAsync(int userId, CreateTransactionDto requestDto)
    {
        // 1. Checks if the requested showtime exists.
        Showtimes? showtime = await _showtimeService.IsShowtimeValid(requestDto.ShowtimeId);
        if (showtime is null)
        {
            Log.Warning("Transaction creation failure. Selected Showtime: {ShowtimeId} does not exist or has finished. User: {UserId}.", requestDto.ShowtimeId, userId);
            return new ServiceResult<TransactionResponseDto>
            {
                IsSuccess = false,
                ErrorType = ErrorType.NotFound
            };
        }

        // 2. Delegate the seats verification to the repository.
        bool unavailable = await _seatsRepository.AreSeatsOccupiedAsync(requestDto.ShowtimeId, requestDto.SeatIds);

        // 2.5 If at least one seat is occupied
        if (unavailable)
        {
            Log.Warning("Transaction creation failure. Selected seats: {SeatIds} are invalid. User: {UserId}", requestDto.SeatIds, userId);
            return new ServiceResult<TransactionResponseDto>
            {
                IsSuccess = false,
                ErrorMessage = "Selected seats are not valid.",
                ErrorType = ErrorType.BadRequest
            };
        }

        // 3. A transactionSeat is created corresponding each selected seat.
        List<TransactionSeats> tranSeats = [];
        foreach(int seatId in requestDto.SeatIds)
        {
            TransactionSeats transactionSeat = new()
            {
                Seat_Id = seatId
            };

            tranSeats.Add(transactionSeat);
        }

        // 4. The transaction is build, nesting the transactionSeats.
        Transactions transactionEntity = new()
        {
            User_Id = userId,
            Showtime_Id = requestDto.ShowtimeId,
            PurchaseDate = DateTime.UtcNow,
            TotalAmount = showtime.Price * requestDto.SeatIds.Count,
            Status = Status.Pending,
            TransactionSeats = tranSeats
        };

        // 5. Delegate the transaction saving to the repository
        Transactions savedEntity = await _transactionRepository.CreateTransactionAsync(transactionEntity);

        // 5.5 Starts de background job to expire the transaction if not already.
        _backgroundJobClient.Schedule<ITransactionService>(
            x => x.ValidateAndExpireTransactionsAsync(savedEntity.Transaction_Id),
            TimeSpan.FromSeconds(15) // Just for demo
            // TimeSpan.FromMinutes(10)
        );

        // 6. Delegates the transaction created fecth to the repository and maps it.
        Transactions? createdTransaction = await _transactionRepository.GetTransactionWithDetailsAsync(savedEntity.Transaction_Id);
        TransactionResponseDto responseDto = _mapper.Map<TransactionResponseDto>(createdTransaction);

        Log.Information("Transaction #{TransactionId} successfully created. User: {UserId}", responseDto.TransactionId, userId);
        return new ServiceResult<TransactionResponseDto>
        {
            IsSuccess = true,
            Data = responseDto
        };
    }

    /// <summary>
    /// -Checks if the transaction requested belongs to the user issuer.
    /// </summary>
    /// <param name="transactionId"></param>
    /// <param name="userId"></param>
    /// <returns>The data of that specific transaction.</returns>
    public async Task<ServiceResult<TransactionResponseDto>> GetTransactionByIdAsync(int transactionId, int userId)
    {
        Transactions? transactionEntity = await _transactionRepository.GetTransactionWithDetailsAsync(transactionId);

        // Bussiness rule: It exists and it belongs to the token's user?
        if (transactionEntity is null || transactionEntity.User_Id != userId)
        {
            return new ServiceResult<TransactionResponseDto>
            {
                IsSuccess = false,
                ErrorType = ErrorType.NotFound
            };
        }

        TransactionResponseDto responseDto = _mapper.Map<TransactionResponseDto>(transactionEntity);

        return new ServiceResult<TransactionResponseDto>
        {
            IsSuccess = true,
            Data = responseDto
        };
    }

    /// <summary>
    /// Checks id the transactions still has the "Pending" Status.
    /// </summary>
    /// <param name="transactionId"></param>
    /// <returns></returns>
    public async Task ValidateAndExpireTransactionsAsync(int transactionId)
    {
        Transactions? transaction = await _transactionRepository.GetTransactionAsync(transactionId);
        if (transaction is null)
        {
            Log.Warning("Transaction #{TransactionId} no longer exists. Changed status is not necessary.", transactionId);
            return;
        }

        if (transaction.Status == Status.Pending)
        {
            Log.Information("Transaction #{TransactionId} exceeded the 15 second Pending time limit. It is updated to expired.", transactionId);
            await _transactionRepository.SetTransactionStatus(transactionId);
        }

    }
}