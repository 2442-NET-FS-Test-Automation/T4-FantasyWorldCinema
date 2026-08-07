using Cinema.ControllerApi.Services;
using Cinema.ControllerApi.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace Cinema.ControllerApi.Controllers;

[ApiController]
[Route("/api/[controller]")]
public class RoomsController : ControllerBase
{
    private readonly IRoomsService _service;

    public RoomsController(IRoomsService service)
    {
        _service = service;
    }

    [HttpGet("Cinema/{cinema_Id}")]
    [ResponseCache(Duration = 30)]
    public async Task<ActionResult<IEnumerable<RoomDto>>> GetRoomsByCinema(int cinema_Id)
    {
        var roomsTuples = await _service.GetRoomsByCinemaIdAsync(cinema_Id);

        var mappedItems = roomsTuples.Select(r => new RoomDto(
            Room_Id: r.Room_Id,
            Cinema_Id: r.Cinema_Id,
            RoomName: r.RoomName
        ));

        return Ok(mappedItems);
    }
}
