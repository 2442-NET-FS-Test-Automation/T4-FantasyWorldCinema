using System.Security.Claims;
using Cinema.ControllerApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Serilog;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TransactionsController : ControllerBase
{
    private readonly ITransactionService _transactionService;
    public TransactionsController(ITransactionService transactionService)
    {
        _transactionService = transactionService;
    }


    /// <summary>
    /// -Gets the userId from the validated user.
    /// -Sends the request for lower layers.
    /// -Checks if it was succesful.
    /// -Return the corresponding code with transaction information.
    /// </summary>
    /// <param name="requestDto"></param>
    /// <returns>Information about the created transaction.</returns>
    [HttpPost]
    public async Task<IActionResult> CreateTransaction([FromBody] CreateTransactionDto requestDto)
    {
        // 1. Getting user ID from the JWT
        string? userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!int.TryParse(userIdClaim, out int userId))
        {
            Log.Warning("Transaction failure. Couldn't get the userId fromm the claims.");
            return Unauthorized("Invalid user token claim.");
        }
        // 2. Sends the request to service and repository layer.
        ServiceResult<TransactionResponseDto> transactionResult = await _transactionService.CreateAsync(userId, requestDto);

        // 3. Checks if the transaction return as invalid. 
        if (!transactionResult.IsSuccess)
        {
            if (transactionResult.ErrorType == ErrorType.NotFound)
            {
                return NotFound(new { message = "Showtime or seats were not found."});
            }
            return BadRequest(new { message = transactionResult.ErrorMessage});
        }
        
        // 4. If success, return 201 Created, with the location of the resource.
        return CreatedAtRoute(
            "GetTransactionById",
            new { transactionId = transactionResult.Data.TransactionId },
            transactionResult.Data
        );
    }

    /// <summary>
    /// -Gets userId from validated user.
    /// -Delegate the search to the service.
    /// -Manage the result.
    /// -Returns Ok if success.
    /// </summary>
    /// <param name="transactionId"></param>
    /// <returns>Information about the specific transaction.</returns>
    [HttpGet("{transactionId:int}", Name = "GetTransactionById")]
    public async Task<IActionResult> GetTransactionByIdAsync(int transactionId)
    {
        // 1. Getting user ID from the JWT
        string? userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!int.TryParse(userIdClaim, out int userId))
        {
            return Unauthorized("Invalid user token claim.");
        }

        // 2. Delegating search to the service sending userId as well.
        ServiceResult<TransactionResponseDto> transactionResult = await _transactionService.GetTransactionByIdAsync(transactionId, userId);

        // 3. Managging the result.
        if (!transactionResult.IsSuccess)
        {
            if (transactionResult.ErrorType == ErrorType.NotFound)
            {
                // Returning 404 either doesn't exists, or if it belongs to other user.
                return NotFound(new { message = "Transaction not found." });
            }
            return BadRequest(new { message = transactionResult.ErrorMessage });
        }

        // 4. Returning 200 OK with DTO
        return Ok(transactionResult.Data);
    }

    [HttpGet("user/")]
    public async Task<ActionResult> GetAllTransactionsByUserAsync()
    { 
        // 1. Getting user ID from the JWT
        string? userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!int.TryParse(userIdClaim, out int userId))
        {
            return Unauthorized("Invalid user token claim.");
        }

        // 2. Sends the request to service and repository layer.
        ServiceResult<IEnumerable<TransactionResponseDto>> transactionsResult = await _transactionService.GetAllTransactionsByUserAsync(userId);

        // 3. Managging the result.
        if (!transactionsResult.IsSuccess)
        {
            if (transactionsResult.ErrorType == ErrorType.NotFound)
            {
                return NotFound(new { message = "No transactions found."});
            }
            return BadRequest(new { message = transactionsResult.ErrorMessage});
        }
        
        // 4. Returning 200 OK with DTO
        return Ok(transactionsResult.Data);
    }

    [HttpPatch("user/{transactionId}")]
    public async Task<ActionResult> UpdateTransactionToCompletedAsync(int transactionId)
    {
        // 1. Getting user ID from the JWT
        string? userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!int.TryParse(userIdClaim, out int userId))
        {
            return Unauthorized("Invalid user token claim.");
        }

        ServiceResult<TransactionResponseDto> serviceResult = await _transactionService.SetPaidTransaction(transactionId, userId);

        // 3. Managging the result.
        if (!serviceResult.IsSuccess)
        {
            if (serviceResult.ErrorType == ErrorType.NotFound)
            {
                return NotFound(new { message = "Could not set transaction to completed."});
            }
            return BadRequest(new { message = serviceResult.ErrorMessage});
        }

        return Ok(serviceResult.Data);
    }

    [HttpPatch("user/cancelled/{transactionId}")]
    public async Task<ActionResult> UpdateTransactionToCancelledAsync(int transactionId)
    {
        string? userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!int.TryParse(userIdClaim, out int userId))
        {
            return Unauthorized("Invalid user token claim.");
        }

        ServiceResult<bool> result = await _transactionService.SetCancelledTransaction(transactionId, userId);

        if (!result.IsSuccess)
        {
            if (result.ErrorType == ErrorType.NotFound)
            {
                return NotFound(new { message = "Could not set transaction to completed."});
            }
            return BadRequest(new { message = result.ErrorMessage});
        }

        return Ok();
    }
}