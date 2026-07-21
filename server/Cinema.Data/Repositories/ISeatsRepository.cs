using Cinema.Data.Entities;

namespace Cinema.Data;

public interface ISeatsRepository
{
    public Task<IReadOnlyList<(int Seat_Id, char Row, int Number, Status LastTransaction)>> GetBusySeatsByShowtimeAsync(int Showtime_Id);
}