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

    [HttpGet("{cinema_Id}")]
    public async Task<ActionResult<IEnumerable<ShowtimeDto>>> GetByCinema(int cinema_Id)
    {
        IReadOnlyList<Showtimes> showtimes = await _service.GetByCinemaAsync(cinema_Id);

        IEnumerable<ShowtimeDto> mappedItems = _mapper.Map<IEnumerable<ShowtimeDto>>(showtimes);
        return Ok(mappedItems);
    }
}