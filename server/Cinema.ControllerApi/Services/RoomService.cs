// Cinema.ControllerApi/Services/RoomsService.cs
using Cinema.Data;

namespace Cinema.ControllerApi.Services;

public class RoomsService : IRoomsService
{
    private readonly IRoomsRepository _repo;

    public RoomsService(IRoomsRepository repo)
    {
        _repo = repo;
    }

    public Task<IReadOnlyList<(int Room_Id, int Cinema_Id, string RoomName)>> GetRoomsByCinemaIdAsync(int cinemaId) 
        => _repo.GetRoomsByCinemaIdAsync(cinemaId);
}
