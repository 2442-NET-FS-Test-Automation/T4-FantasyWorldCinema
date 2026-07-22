using AutoMapper;
using Cinema.ControllerApi.DTOs;
using Cinema.ControllerApi.Services;
using Cinema.Data.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;

[ApiController]
[Route("/api/[controller]")]
public class SeatsController : ControllerBase
{
    private readonly ISeatsService _service;
    private readonly IMapper _mapper;

    public SeatsController(ISeatsService service, IMapper mapper)
    {
        _service = service;
        _mapper = mapper;
    }

    [HttpGet("{Showtime_Id}")]
    public async Task<ActionResult<IEnumerable<SeatsDTO>>> GetSeatsByShowtimeAsync(int Showtime_Id, int Room_Id)
    {
        IReadOnlyList<(int Seat_Id, char Row, int Number, Status LastTransaction)> seats 
            = await _service.GetSeatsByShowtimeAsync(Showtime_Id, Room_Id);
        
        IEnumerable<SeatsDTO> mappedSeats = _mapper.Map<IEnumerable<SeatsDTO>>(seats);
        return Ok(mappedSeats);
    }
}