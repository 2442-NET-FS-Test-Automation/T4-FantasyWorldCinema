// Cinema.Data/RoomsRepository.cs
using Cinema.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace Cinema.Data;

public class RoomsRepository : IRoomsRepository
{
    private readonly IDbContextFactory<CinemaDbContext> _factory;

    public RoomsRepository(IDbContextFactory<CinemaDbContext> factory)
    {
        _factory = factory;
    }

    public async Task<IReadOnlyList<(int Room_Id, int Cinema_Id, string RoomName)>> GetRoomsByCinemaIdAsync(int cinemaId)
    {
        using CinemaDbContext db = await _factory.CreateDbContextAsync();

        var roomsList = await db.Rooms
            .Where(r => r.Cinema_Id == cinemaId)
            .Select(r => new { r.Room_Id, r.Cinema_Id, r.RoomName })
            .ToListAsync();

        return roomsList
            .Select(r => (r.Room_Id, r.Cinema_Id, r.RoomName))
            .ToList()
            .AsReadOnly();
    }
}
