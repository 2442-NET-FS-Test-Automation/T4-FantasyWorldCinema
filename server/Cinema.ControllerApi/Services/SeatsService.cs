using Cinema.ControllerApi.DTOs;
using Cinema.Data.Entities;
using Cinema.Data;

namespace Cinema.ControllerApi.Services;

public class SeatsService : ISeatsService
{
    private readonly ISeatsRepository _repo;

    public SeatsService(ISeatsRepository repo)
    {
        _repo = repo;
    }

    // Get a list of Seats and their status for a given showtime
    public Task<IReadOnlyList<(int Seat_Id, char Row, int Number, Status LastTransaction)>> GetSeatsByShowtimeAsync(int Showtime_Id, int Room_Id)
    => _repo.GetSeatsByShowtimeAsync(Showtime_Id, Room_Id);
}