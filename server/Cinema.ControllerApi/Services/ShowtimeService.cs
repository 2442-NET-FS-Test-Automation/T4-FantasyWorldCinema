using Cinema.ControllerApi.DTOs;
using Cinema.Data.Entities;
using Cinema.Data;

namespace Cinema.ControllerApi.Services;

public class ShowtimeService : IShowtimeService
{
    private readonly IShowtimeRepository _repo;

    public ShowtimeService(IShowtimeRepository repo)
    {
        _repo = repo;
    }

    // Get a list of Showtimes that are available to see on some cinema
    public Task<IReadOnlyList<Showtimes>> GetByCinemaAsync(int cinema_Id) => _repo.GetShowtimesByCinemaAsync(cinema_Id);
}