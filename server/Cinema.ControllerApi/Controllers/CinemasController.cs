using AutoMapper;
using Cinema.ControllerApi.DTOs;
using Cinema.ControllerApi.Services;
using Cinema.Data.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;

[ApiController]
[Route("/api/[controller]")]
public class CinemaController : ControllerBase
{
    private readonly ICinemaService _service;
    private readonly IMapper _mapper;

    public CinemaController(ICinemaService service, IMapper mapper)
    {
        _service = service;
        _mapper = mapper;
    }

    [HttpGet]
    [ResponseCache(Duration = 30)]
    public async Task<ActionResult<IEnumerable<SimpleCinemaDto>>> GetCinemas()
    {
        IReadOnlyList<Cinemas> cinemas = await _service.GetCinemasAsync();

        IEnumerable<SimpleCinemaDto> mappedItems = _mapper.Map<IEnumerable<SimpleCinemaDto>>(cinemas);
        return Ok(mappedItems);
    }
}