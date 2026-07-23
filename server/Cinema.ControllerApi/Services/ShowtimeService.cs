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

    public Task<Showtimes> GetShowtimeByIdAsync(int Showtime_Id) => _repo.GetShowtimeById(Showtime_Id);

    /// <summary>
    /// Checks if the showtime exists and if the end of the showtime is later than the present time.
    /// </summary>
    /// <param name="showtimeId"></param>
    /// <returns></returns>
    public async Task<Showtimes?> IsShowtimeValid(int showtimeId)
    {
        Showtimes? currentShowtime = await _repo.GetShowtimeById(showtimeId);
        if (currentShowtime is null) return null;

        DateTime endTime = currentShowtime.ShowDate.ToDateTime(currentShowtime.EndTime);

        DateTime nowsTime = DateTime.UtcNow;

        return endTime > nowsTime ? currentShowtime : null;
    }
}