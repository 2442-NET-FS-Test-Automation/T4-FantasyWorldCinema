using Cinema.Data.Entities;

namespace Cinema.Data;

public interface IMoviesRepository
{
    public Task<IReadOnlyList<Movies>> GetMoviesAsync();
}