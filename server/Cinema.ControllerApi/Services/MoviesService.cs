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

    public async Task<Movies?> SetMoviesAsync(MovieCreateDto data)
    {
        if(data.Title.Length <= 0) return null;
        if(!Enum.TryParse<Genre>(data.Genre, out Genre newGenre)) return null;
        if(!Enum.TryParse<Rating>(data.Rating, out Rating newRating)) return null;

        return  await _repo.SetMoviesAsync(data.Title, newGenre, data.DurationMinutes,
        newRating, data.Synopsis, data.Poster);
    }

    public Task<IReadOnlyList<Movies>> GetAllMoviesAsync() => _repo.GetAllMoviesAsync();

    public async Task<Movies?> UpdateMoviesAsync(MoviesDTO data)
    {
        if(data.Title.Length <= 0) return null;
        if(!Enum.TryParse<Genre>(data.Genre, out Genre newGenre)) return null;
        if(!Enum.TryParse<Rating>(data.Rating, out Rating newRating)) return null;

        return await _repo.UpdateMovieAsync(data.Movie_Id, data.Title, newGenre, 
            data.DurationMinutes, newRating, data.Synopsis, data.Poster);
    }

    public Task<bool> RemoveMovieAsync(int movie_Id) => _repo.RemoveMovieAsync(movie_Id);

}