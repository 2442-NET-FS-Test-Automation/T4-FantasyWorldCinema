using System.Security.Claims;
using Cinema.ControllerApi.DTOs;
using Cinema.ControllerApi.Services;
using Cinema.Data.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Serilog;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class ReportsController : ControllerBase
{
    private readonly IReportsService _reportsService;

    public ReportsController(IReportsService reportsService)
    {
        _reportsService = reportsService;
    }

    [HttpGet("cinema-performance")]
    public async Task<IActionResult> GetCinemaPerformanceAsync([FromQuery] RequestGenericReportDto requestDto)
    {
        string? userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!int.TryParse(userIdClaim, out int userId))
        {
            return Unauthorized("Invalid user token claim.");
        }

        ServiceResult<IEnumerable<CinemaRevenueDto>> result = await _reportsService.GetCinemaPerformanceAsync(requestDto.StartDate, requestDto.EndDate);

        if (!result.IsSuccess)
        {
            if (result.ErrorType == ErrorType.NotFound)
            {
                return NotFound(new { message = "No transactions found."});
            }
            return BadRequest(new { message = result.ErrorMessage});
        }
        
        return Ok(result.Data);
    }

    [HttpGet("occupancy-rates")]
    public async Task<IActionResult> GetOccupancyRatesAsync([FromQuery] RequestOccupancyRatesDto requestDto)
    {
        string? userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!int.TryParse(userIdClaim, out int userId))
        {
            return Unauthorized("Invalid user token claim.");
        }

        ServiceResult<IEnumerable<OccupancyRateDto>> result = await _reportsService.GetOccupancyRatesAsync(requestDto.StartDate, requestDto.EndDate, requestDto.CinemaId);

        if (!result.IsSuccess)
        {
            if (result.ErrorType == ErrorType.NotFound)
            {
                return NotFound(new { message = "No transactions found."});
            }
            return BadRequest(new { message = result.ErrorMessage});
        }
        
        return Ok(result.Data);
    }

    [HttpGet("top-movies")]
    public async Task<IActionResult> GetTopMoviesByRevenueAsync([FromQuery] RequestTopMoviesByRevenueDto requestDto)
    {
        string? userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!int.TryParse(userIdClaim, out int userId))
        {
            return Unauthorized("Invalid user token claim.");
        }

        ServiceResult<IEnumerable<MovieRevenueDto>> result = await _reportsService.GetTopMoviesByRevenueAsync(requestDto.StartDate, requestDto.EndDate, requestDto.Limit);

        if (!result.IsSuccess)
        {
            if (result.ErrorType == ErrorType.NotFound)
            {
                return NotFound(new { message = "No transactions found."});
            }
            return BadRequest(new { message = result.ErrorMessage});
        }
        
        return Ok(result.Data);
    }

    [HttpGet("transaction-status")]
    public async Task<IActionResult> GetTransactionStatusSummaryAsync([FromQuery] RequestGenericReportDto requestDto)
    {
        string? userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!int.TryParse(userIdClaim, out int userId))
        {
            return Unauthorized("Invalid user token claim.");
        }

        ServiceResult<IEnumerable<TransactionStatusSummaryDto>> result = await _reportsService.GetTransactionStatusSummaryAsync(requestDto.StartDate, requestDto.EndDate);

        if (!result.IsSuccess)
        {
            if (result.ErrorType == ErrorType.NotFound)
            {
                return NotFound(new { message = "No transactions found."});
            }
            return BadRequest(new { message = result.ErrorMessage});
        }
        
        return Ok(result.Data);
    }

    [HttpGet("total-tickets-sold")]
    public async Task<IActionResult> GetTotalTicketsSold([FromQuery] RequestGenericReportDto requestDto)
    {
        string? userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!int.TryParse(userIdClaim, out int userId))
        {
            return Unauthorized("Invalid user token claim.");
        }

        ServiceResult<int> result = await _reportsService.GetTotalTicketsSold(requestDto.StartDate, requestDto.EndDate);
        return Ok(result.Data);
    }
    
    [HttpGet("total-revenue")]
    public async Task<IActionResult> GetTotalRevenue([FromQuery] RequestGenericReportDto requestDto)
    {
        string? userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!int.TryParse(userIdClaim, out int userId))
        {
            return Unauthorized("Invalid user token claim.");
        }

        ServiceResult<decimal> result = await _reportsService.GetTotalRevenue(requestDto.StartDate, requestDto.EndDate);
        return Ok(result.Data);
    }
}