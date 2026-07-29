using Cinema.Data.Entities;

namespace Cinema.Data;

public interface IShowtimeRepository
{
    public Task<IReadOnlyList<Showtimes>> GetAllShowtimesAsync();
    public Task<Showtimes> AddShowtimeAsync(int movie_Id, int room_Id, string showdate, 
        string startTime, string endTime, decimal price);
    public Task<Showtimes> UpdateShowtimeAsync(int showtimeId, int movie_Id, int room_Id, string showdate, 
        string startTime, string endTime, decimal price);
    public Task<bool> RemoveShowtimeAsync(int showtime_Id);
    public Task<IReadOnlyList<Showtimes>> GetShowtimesByCinemaAsync(int cinema_Id);
    public Task<Showtimes> GetShowtimeById(int Showtime_Id);
}