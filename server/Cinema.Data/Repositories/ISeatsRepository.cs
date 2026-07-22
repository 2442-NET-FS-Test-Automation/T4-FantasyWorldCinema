using Cinema.Data.Entities;

namespace Cinema.Data;

public interface ISeatsRepository
{
    public Task<IReadOnlyList<(int Seat_Id, char Row, int Number, Status LastTransaction)>> 
        GetSeatsByShowtimeAsync(int Showtime_Id, int Room_Id);
}