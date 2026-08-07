using Cinema.Data;

namespace Cinema.ControllerApi.Services;

public interface IRoomsService
{
    public Task<IReadOnlyList<(int Room_Id, int Cinema_Id, string RoomName)>> GetRoomsByCinemaIdAsync(int cinemaId);
}
