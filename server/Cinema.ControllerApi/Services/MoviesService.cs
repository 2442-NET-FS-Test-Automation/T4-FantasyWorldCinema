using Cinema.ControllerApi.DTOs;
using Cinema.Data.Entities;
using Cinema.Data;

namespace Cinema.ControllerApi.Services;

public class MoviesService : IMoviesService
{
    private readonly IMoviesRepository _repo;

    public MoviesService(IMoviesRepository repo)
    {
        _repo = repo;
    }

    public async Task<IReadOnlyList<Movies>> GetMoviesAsync() => await _repo.GetMoviesAsync();

    public Task<Movies> SetMoviesAsync(MovieCreateDto nm)
    {
        return _repo.SetMoviesAsync(nm.Title, nm.Genre, nm.DurationMinutes,
        nm.Rating, nm.Synopsis, nm.Poster);
    }

    public Task<IReadOnlyList<Movies>> GetAllMoviesAsync() => _repo.GetAllMoviesAsync();

    public async Task<Movies?> UpdateMoviesAsync(MoviesDTO data) => await _repo.UpdateMovieAsync(data.Movie_Id,
        data.Title, data.Genre, data.DurationMinutes, data.Rating, data.Synopsis, data.Poster);

}