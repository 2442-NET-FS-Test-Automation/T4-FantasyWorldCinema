using Cinema.Data.DTOs;
using Cinema.Data.Entities;

namespace Cinema.ControllerApi.Services;

public interface ICinemaService
{
    public Task<IReadOnlyList<Cinemas>> GetCinemasAsync();
    public Task<IReadOnlyList<Cinemas>> GetCinemasByMovieAsync(int Movie_Id);
    public Task<ServiceResult<IEnumerable<CinemasWithUsedDto>>> GetCinemasWithUsedTransactions(DateTime startDate, DateTime endDate);
    public Task<ServiceResult<int>> GetCinemasWithActiveShowtimes(DateTime startDate, DateTime endDate);
}