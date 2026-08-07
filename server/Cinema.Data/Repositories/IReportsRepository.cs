using Cinema.Data.DTOs;

namespace Cinema.Data;

public interface IReportsRepository
{
    /// <summary>
    /// Obtains the top films that have generated the most income in a range of dates.
    /// </summary>
    Task<IEnumerable<MovieRevenueDto>> GetTopMoviesByRevenueAsync(
        DateTime startDate, 
        DateTime endDate, 
        int limit = 10,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Obtains the financial performance and number of transactions grouped by branch.
    /// </summary>
    Task<IEnumerable<CinemaRevenueDto>> GetCinemaPerformanceAsync(
        DateTime startDate, 
        DateTime endDate,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Calculate the occupancy rate (sold seats vs total capacity) of the performances.
    /// It can optionally be filtered by a specific cinema.
    /// </summary>
    Task<IEnumerable<OccupancyRateDto>> GetOccupancyRatesAsync(
        DateTime startDate, 
        DateTime endDate,
        int? cinemaId = null,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Returns a summary with the count and total amount grouped by each transaction status.
    /// </summary>
    Task<IEnumerable<TransactionStatusSummaryDto>> GetTransactionStatusSummaryAsync(
        DateTime startDate, 
        DateTime endDate,
        CancellationToken cancellationToken = default);

    public Task<int> GetTotalTicketsSold(DateTime startDate, DateTime endDate);
    public Task<decimal> GetTotalRevenue(DateTime startDate, DateTime endDate);
}
