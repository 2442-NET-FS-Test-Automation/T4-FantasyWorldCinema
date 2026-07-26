using Cinema.ControllerApi.DTOs;
using Cinema.Data;
using Cinema.Data.Entities;

namespace Cinema.ControllerApi.Services;

public interface IMoviesService
{
    public Task<IReadOnlyList<Movies>> GetMoviesAsync();
}