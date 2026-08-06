using Cinema.ControllerApi.DTOs;
using Cinema.Data;
using Cinema.Data.Entities;

namespace Cinema.ControllerApi.Services;

public interface IMoviesService
{
    public Task<IReadOnlyList<Movies>> GetMoviesAsync();
    public Task<Movies?> SetMoviesAsync(MovieCreateDto newMovie);
    public Task<Movies?> UpdateMoviesAsync(MoviesDTO data);
    public Task<bool> RemoveMovieAsync(int movie_Id);
    public Task<IReadOnlyList<Movies>> GetAllMoviesAsync();
}