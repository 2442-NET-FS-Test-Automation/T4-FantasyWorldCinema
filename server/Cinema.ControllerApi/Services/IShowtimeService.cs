using Cinema.ControllerApi.DTOs;
using Cinema.Data.Entities;

namespace Cinema.ControllerApi.Services;

public interface IShowtimeService
{
    public Task<IReadOnlyList<Showtimes>> GetByCinemaAsync(int cinema_Id);
}