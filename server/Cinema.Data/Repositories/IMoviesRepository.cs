using Cinema.Data.Entities;

namespace Cinema.Data;

public interface IMoviesRepository
{
    public Task<IReadOnlyList<Movies>> GetMoviesAsync();

    public Task<Movies> SetMoviesAsync(string title, string genre, 
        int durationMinutes, string rating, string synopsis, string poster);
}