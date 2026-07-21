using Cinema.ControllerApi.DTOs;
using Cinema.Data.Entities;
using Cinema.Data;

namespace Cinema.ControllerApi.Services;

public class SeatsService : ISeatsService
{
    private readonly IShowtimeRepository _repo;

    public SeatsService(IShowtimeRepository repo)
    {
        _repo = repo;
    }

    // Get a list of Seats and their status for a given showtime
    public 
}