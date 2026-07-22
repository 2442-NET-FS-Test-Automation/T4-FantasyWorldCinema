using Cinema.Data.Entities;

namespace Cinema.ControllerApi.Services;

public interface ICinemaService
{
    public Task<IReadOnlyList<Cinemas>> GetCinemasAsync();
}