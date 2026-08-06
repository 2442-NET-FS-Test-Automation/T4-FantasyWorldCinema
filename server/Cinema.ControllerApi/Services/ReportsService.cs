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
        IEnumerable<CinemaRevenueDto> cinemaRevenues = await _reportsRepository.GetCinemaPerformanceAsync(startDate, endDate);
        if (!cinemaRevenues.Any())
        {
            return new ServiceResult<IEnumerable<CinemaRevenueDto>>
            {
                IsSuccess = false,
                ErrorType = ErrorType.NotFound
            };
        }

        return new ServiceResult<IEnumerable<CinemaRevenueDto>>
        {
            IsSuccess = true,
            Data = cinemaRevenues
        };
    }   

    public async Task<ServiceResult<IEnumerable<OccupancyRateDto>>> GetOccupancyRatesAsync(DateTime startDate, DateTime endDate, int? cinemaId = null)
    {
        IEnumerable<OccupancyRateDto> occupancyRates = await _reportsRepository.GetOccupancyRatesAsync(startDate, endDate, cinemaId);
        if (!occupancyRates.Any())
        {
            return new ServiceResult<IEnumerable<OccupancyRateDto>>
            {
                IsSuccess = false,
                ErrorType = ErrorType.NotFound
            };
        }

        return new ServiceResult<IEnumerable<OccupancyRateDto>>
        {
            IsSuccess = true,
            Data = occupancyRates
        };
    }

    public async Task<ServiceResult<IEnumerable<MovieRevenueDto>>> GetTopMoviesByRevenueAsync(DateTime startDate, DateTime endDate, int limit = 10)
    {
        IEnumerable<MovieRevenueDto> topMovies = await _reportsRepository.GetTopMoviesByRevenueAsync(startDate, endDate, limit);
        if (!topMovies.Any())
        {
            return new ServiceResult<IEnumerable<MovieRevenueDto>>
            {
                IsSuccess = false,
                ErrorType = ErrorType.NotFound
            };
        }

        return new ServiceResult<IEnumerable<MovieRevenueDto>>
        {
            IsSuccess = true,
            Data = topMovies
        };
    }

    public async Task<ServiceResult<IEnumerable<TransactionStatusSummaryDto>>> GetTransactionStatusSummaryAsync(DateTime startDate, DateTime endDate)
    {
        IEnumerable<TransactionStatusSummaryDto> statusSummary = await _reportsRepository.GetTransactionStatusSummaryAsync(startDate, endDate);
        if (!statusSummary.Any())
        {
            return new ServiceResult<IEnumerable<TransactionStatusSummaryDto>>
            {
                IsSuccess = false,
                ErrorType = ErrorType.NotFound
            };
        }

        return new ServiceResult<IEnumerable<TransactionStatusSummaryDto>>
        {
            IsSuccess = true,
            Data = statusSummary
        };
    }
}