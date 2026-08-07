using Cinema.Data.Entities;

namespace Cinema.Data;

public interface IRoomsRepository
{
    public Task<IReadOnlyList<(int Room_Id, int Cinema_Id, string RoomName)>> 
        GetRoomsByCinemaIdAsync(int cinemaId);
}
