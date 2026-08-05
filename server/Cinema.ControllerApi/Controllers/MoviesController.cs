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
    [ResponseCache(Duration = 30)]
    public async Task<ActionResult<IEnumerable<MoviesDTO>>> GetMoviesAsync()
    {
        IReadOnlyList<Movies> movies = await _service.GetMoviesAsync();

        IEnumerable<MoviesDTO> mappedItems = _mapper.Map<IEnumerable<MoviesDTO>>(movies);
        return Ok(mappedItems);
    }

    [HttpGet("/api/Movies/All")]
    public async Task<ActionResult<IEnumerable<MoviesDTO>>> GetAllMoviesAsync()
    {
        IReadOnlyList<Movies> movies = await _service.GetAllMoviesAsync();

        IEnumerable<MoviesDTO> mappedItems = _mapper.Map<IEnumerable<MoviesDTO>>(movies);
        return Ok(mappedItems);
    }


    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<MoviesDTO>> PostMovieAsync(MovieCreateDto newMovie)
    {
        Movies created = await _service.SetMoviesAsync(newMovie);
        MoviesDTO mapped = _mapper.Map<MoviesDTO>(created);
        return Created("", mapped);
    }

    [HttpPut]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<MoviesDTO>> UpdateMovieAsync(MoviesDTO movie)
    {
        Movies? updated = await _service.UpdateMoviesAsync(movie);

        if(updated == null) return NotFound();

        MoviesDTO mapped = _mapper.Map<MoviesDTO>(updated);
        return Ok(mapped);
    }

    [HttpDelete]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<bool>> RemoveMovieAsync(int movie_Id)
    {
        bool isDeleted = await _service.RemoveMovieAsync(movie_Id);

        if(isDeleted) return NoContent();

        return NotFound();
    }
}