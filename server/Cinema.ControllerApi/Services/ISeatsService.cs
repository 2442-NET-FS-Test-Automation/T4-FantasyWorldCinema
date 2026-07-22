using Cinema.ControllerApi.DTOs;
using Cinema.Data.Entities;

namespace Cinema.ControllerApi.Services;

public interface ISeatsService
{
    public Task<IReadOnlyList<(int Seat_Id, char Row, int Number, Status LastTransaction)>> 
        GetSeatsByShowtimeAsync(int Showtime_Id, int Room_Id);
}