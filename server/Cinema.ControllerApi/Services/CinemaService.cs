using Cinema.Data;
using Cinema.Data.DTOs;
using Cinema.Data.Entities;

namespace Cinema.ControllerApi.Services;

public class CinemaService : ICinemaService
{
    private readonly ICinemaRepository _repo;

    public CinemaService(ICinemaRepository repo)
    {
        _repo = repo;
    }

    public Task<IReadOnlyList<Cinemas>> GetCinemasAsync() => _repo.GetCinemasAsync();

    public async Task<IReadOnlyList<Cinemas>> GetCinemasByMovieAsync(int Movie_Id) => await _repo.GetCinemasByMovieAsync(Movie_Id);

    public async Task<ServiceResult<IEnumerable<CinemasWithUsedDto>>> GetCinemasWithUsedTransactions()
    {
        IEnumerable<CinemasWithUsedDto> cinemas = await _repo.GetCinemasWithUsedTransactions();
        if (!cinemas.Any())
        {
            return new ServiceResult<IEnumerable<CinemasWithUsedDto>>
            {
                IsSuccess = false,
                ErrorType = ErrorType.NotFound
            };
        }

        return new ServiceResult<IEnumerable<CinemasWithUsedDto>>
        {
            IsSuccess = true,
            Data = cinemas
        };
    }
}