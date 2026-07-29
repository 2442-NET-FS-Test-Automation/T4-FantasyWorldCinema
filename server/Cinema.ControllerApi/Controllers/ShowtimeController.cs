using AutoMapper;
using Cinema.ControllerApi.DTOs;
using Cinema.ControllerApi.Services;
using Cinema.Data.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;


[ApiController]
[Route("api/[controller]")]
public class ShowtimeController : ControllerBase
{
    private readonly IShowtimeService _service;
    private readonly IMapper _mapper;

    public ShowtimeController(IShowtimeService service, IMapper mapper)
    {
        _service = service;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ShowtimeDto>>> GetAllShowtimesAsync()
    {
        IReadOnlyList<Showtimes> showtimes = await _service.GetAllShowtimesAsync();

        IEnumerable<ShowtimeDto> mappedItems = _mapper.Map<IEnumerable<ShowtimeDto>>(showtimes);
        return Ok(mappedItems);
    }

    [HttpPost]
    [Authorize(Roles = "admin")]
    public async Task<ActionResult<ShowtimeDto>> PostShowtimeAsync(ShowtimeCreateDto data)
    {
        Showtimes newShowtime = await _service.AddShowtimeAsync(data);
        ShowtimeDto mapped = _mapper.Map<ShowtimeDto>(newShowtime);

        return CreatedAtAction(nameof(GetShowtimeByIdAsync), new { id = newShowtime.Showtime_Id, newShowtime});
    }

    [HttpGet("Cinema-{cinema_Id}")]
    public async Task<ActionResult<IEnumerable<ShowtimeDto>>> GetByCinema(int cinema_Id)
    {
        IReadOnlyList<Showtimes> showtimes = await _service.GetByCinemaAsync(cinema_Id);

        IEnumerable<ShowtimeDto> mappedItems = _mapper.Map<IEnumerable<ShowtimeDto>>(showtimes);
        return Ok(mappedItems);
    }

    [HttpGet("{showtimeId}")]
    public async Task<IActionResult> GetShowtimeByIdAsync(int showtimeId)
    {
        Showtimes? showtime = await _service.GetShowtimeByIdAsync(showtimeId);

        if (showtime is null)
        {
            return NotFound(new { message = "Showtime not found"});
        }

        ShowtimeDto mappedItems = _mapper.Map<ShowtimeDto>(showtime);
        return Ok(mappedItems);
    }

}