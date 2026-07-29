using Cinema.ControllerApi.DTOs;
using Cinema.Data.Entities;

namespace Cinema.ControllerApi.Services;

public interface IShowtimeService
{
    public Task<IReadOnlyList<Showtimes>> GetByCinemaAsync(int cinema_Id);
    public Task<Showtimes> AddShowtimeAsync(ShowtimeCreateDto ns);
    public Task<Showtimes?> UpdateShowtimeAsync(ShowtimeUpdateDto ns);
    public Task<bool> RemoveShowtimeAsync(int showtime_Id);
    public Task<IReadOnlyList<Showtimes>> GetAllShowtimesAsync();
    public Task<Showtimes> GetShowtimeByIdAsync(int Showtime_Id);
    public Task<Showtimes?> IsShowtimeValid(int showtimeId);
}