using Cinema.Data.DTOs;

namespace Cinema.ControllerApi.Services;

public interface IReportsService
{
    public Task<ServiceResult<IEnumerable<MovieRevenueDto>>> GetTopMoviesByRevenueAsync(DateTime startDate, DateTime endDate, int limit = 10);

    public  Task<ServiceResult<IEnumerable<CinemaRevenueDto>>> GetCinemaPerformanceAsync(DateTime startDate, DateTime endDate);

    public Task<ServiceResult<IEnumerable<OccupancyRateDto>>> GetOccupancyRatesAsync(DateTime startDate, DateTime endDate, int? cinemaId = null);

    public Task<ServiceResult<IEnumerable<TransactionStatusSummaryDto>>> GetTransactionStatusSummaryAsync(DateTime startDate, DateTime endDate);
    public Task<ServiceResult<int>> GetTotalTicketsSold(DateTime startDate, DateTime endDate);

}