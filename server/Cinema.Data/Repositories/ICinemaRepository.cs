using Cinema.Data.DTOs;
using Cinema.Data.Entities;

namespace Cinema.Data;

public interface ICinemaRepository
{
    public Task<IReadOnlyList<Cinemas>> GetCinemasAsync();
    public Task<IReadOnlyList<Cinemas>> GetCinemasByMovieAsync(int Movie_Id);
    public Task<IEnumerable<CinemasWithUsedDto>> GetCinemasWithUsedTransactions();
}