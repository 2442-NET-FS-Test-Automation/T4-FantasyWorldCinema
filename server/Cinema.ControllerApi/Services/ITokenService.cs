using Cinema.Data.Entities;

namespace Cinema.ControllerApi.Services;

public interface ITokenService
{
    string Issue(Users user);
}