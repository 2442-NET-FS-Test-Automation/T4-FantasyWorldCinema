using Cinema.Data;
using Cinema.Data.DTOs;

namespace Cinema.ControllerApi.Services;

public class ReportsService : IReportsService
{
    private readonly IReportsRepository _reportsRepository;

    public ReportsService(IReportsRepository reportsRepository)
    {
        _reportsRepository = reportsRepository;
    }

    public async Task<ServiceResult<IEnumerable<CinemaRevenueDto>>> GetCinemaPerformanceAsync(DateTime startDate, DateTime endDate)
    {
        if (startDate > endDate)
        {
            return new ServiceResult<IEnumerable<CinemaRevenueDto>> { IsSuccess = false, ErrorType = ErrorType.BadRequest, ErrorMessage = "Invalid date range." };
        }

        IEnumerable<CinemaRevenueDto> cinemaRevenues = await _reportsRepository.GetCinemaPerformanceAsync(startDate, endDate);

        return new ServiceResult<IEnumerable<CinemaRevenueDto>>
        {
            IsSuccess = true,
            Data = cinemaRevenues
        };
    }   

    public async Task<ServiceResult<IEnumerable<OccupancyRateDto>>> GetOccupancyRatesAsync(DateTime startDate, DateTime endDate, int? cinemaId = null)
    {
        if (startDate > endDate)
        {
            return new ServiceResult<IEnumerable<OccupancyRateDto>> { IsSuccess = false, ErrorType = ErrorType.BadRequest, ErrorMessage = "Invalid date range." };
        }

        IEnumerable<OccupancyRateDto> occupancyRates = await _reportsRepository.GetOccupancyRatesAsync(startDate, endDate, cinemaId);

        return new ServiceResult<IEnumerable<OccupancyRateDto>>
        {
            IsSuccess = true,
            Data = occupancyRates
        };
    }

    public async Task<ServiceResult<IEnumerable<MovieRevenueDto>>> GetTopMoviesByRevenueAsync(DateTime startDate, DateTime endDate, int limit = 10)
    {
        if (startDate > endDate)
        {
            return new ServiceResult<IEnumerable<MovieRevenueDto>> { IsSuccess = false, ErrorType = ErrorType.BadRequest, ErrorMessage = "Invalid date range." };
        }

        IEnumerable<MovieRevenueDto> topMovies = await _reportsRepository.GetTopMoviesByRevenueAsync(startDate, endDate, limit);

        return new ServiceResult<IEnumerable<MovieRevenueDto>>
        {
            IsSuccess = true,
            Data = topMovies
        };
    }

    public async Task<ServiceResult<IEnumerable<TransactionStatusSummaryDto>>> GetTransactionStatusSummaryAsync(DateTime startDate, DateTime endDate)
    {
        if (startDate > endDate)
        {
            return new ServiceResult<IEnumerable<TransactionStatusSummaryDto>> { IsSuccess = false, ErrorType = ErrorType.BadRequest, ErrorMessage = "Invalid date range." };
        }

        IEnumerable<TransactionStatusSummaryDto> statusSummary = await _reportsRepository.GetTransactionStatusSummaryAsync(startDate, endDate);

        return new ServiceResult<IEnumerable<TransactionStatusSummaryDto>>
        {
            IsSuccess = true,
            Data = statusSummary
        };
    }

    public async Task<ServiceResult<int>> GetTotalTicketsSold(DateTime startDate, DateTime endDate)
    {
        if (startDate > endDate)
        {
            return new ServiceResult<int> { IsSuccess = false, ErrorType = ErrorType.BadRequest, ErrorMessage = "Invalid date range." };
        }

        int result = await _reportsRepository.GetTotalTicketsSold(startDate, endDate);

        return new ServiceResult<int>
        {
            IsSuccess = true,
            Data = result
        };
    }
    
    public async Task<ServiceResult<decimal>> GetTotalRevenue(DateTime startDate, DateTime endDate)
    {
        if (startDate > endDate)
        {
            return new ServiceResult<decimal> { IsSuccess = false, ErrorType = ErrorType.BadRequest, ErrorMessage = "Invalid date range." };
        }

        decimal result = await _reportsRepository.GetTotalRevenue(startDate, endDate);

        return new ServiceResult<decimal>
        {
            IsSuccess = true,
            Data = result
        };
    }
}