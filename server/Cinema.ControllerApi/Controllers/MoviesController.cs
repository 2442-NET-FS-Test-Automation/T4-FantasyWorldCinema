using AutoMapper;
using Cinema.ControllerApi.DTOs;
using Cinema.ControllerApi.Services;
using Cinema.Data.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;

[ApiController]
[Route("/api/[controller]")]
public class MoviesController : ControllerBase
{
    private readonly IMoviesService _service;
    private readonly IMapper _mapper;

    public MoviesController(IMoviesService service, IMapper mapper)
    {
        _service = service;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<MoviesDTO>>> GetMoviesAsync()
    {
        IReadOnlyList<Movies> movies = await _service.GetMoviesAsync();

        IEnumerable<MoviesDTO> mappedItems = _mapper.Map<IEnumerable<MoviesDTO>>(movies);
        return Ok(mappedItems);
    }
}