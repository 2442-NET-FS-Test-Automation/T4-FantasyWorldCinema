using Cinema.Data.Entities;

namespace Cinema.Data;

public interface IMoviesRepository
{
    public Task<IReadOnlyList<Movies>> GetMoviesAsync();
    public Task<IReadOnlyList<Movies>> GetAllMoviesAsync();

    public Task<Movies> SetMoviesAsync(string title, Genre genre, 
        int durationMinutes, Rating rating, string synopsis, string poster);
    public Task<Movies?> UpdateMovieAsync(int movie_Id, string title, Genre genre, 
        int durationMinutes, Rating rating, string synopsis, string poster);
    public Task<bool> RemoveMovieAsync(int movie_Id);
}