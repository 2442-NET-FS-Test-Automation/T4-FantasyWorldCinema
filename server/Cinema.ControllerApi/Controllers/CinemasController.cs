using AutoMapper;
using Cinema.ControllerApi.DTOs;
using Cinema.ControllerApi.Services;
using Cinema.Data.DTOs;
using Cinema.Data.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
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

    [HttpGet("/api/Cinema/{Movie_Id}")]
    [ResponseCache(Duration = 60)]
    public async Task<ActionResult<IEnumerable<SimpleCinemaDto>>> GetCinemasByMovie(int Movie_Id)
    {
        IReadOnlyList<Cinemas> cinemas = await _service.GetCinemasByMovieAsync(Movie_Id);

        IEnumerable<SimpleCinemaDto> mappedItems = _mapper.Map<IEnumerable<SimpleCinemaDto>>(cinemas);
        return Ok(mappedItems);
    }

    [HttpGet("cinemas-withUsed")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetCinemasWithUsedAsync()
    {
        string? userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!int.TryParse(userIdClaim, out int userId))
        {
            return Unauthorized("Invalid user token claim.");
        }

        ServiceResult<IEnumerable<CinemasWithUsedDto>> result = await _service.GetCinemasWithUsedTransactions();

        if (!result.IsSuccess)
        {
            if (result.ErrorType == ErrorType.NotFound)
            {
                return NotFound(new { message = "No cinemas found."});
            }
            return BadRequest(new { message = result.ErrorMessage});
        }
        
        return Ok(result.Data);
    }
}