using Cinema.Data.Entities;

namespace Cinema.Data;

public interface ICinemaRepository
{
    public Task<IReadOnlyList<Cinemas>> GetCinemasAsync();
}