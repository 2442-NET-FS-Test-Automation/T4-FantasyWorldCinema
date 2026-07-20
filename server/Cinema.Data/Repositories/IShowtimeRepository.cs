using Cinema.Data.Entities;

namespace Cinema.Data;

public interface IShowtimeRepository
{
    public Task<IReadOnlyList<Showtimes>> GetShowtimesByCinemaAsync(int cinema_Id);
}