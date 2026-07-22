using Cinema.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace Cinema.Data;

public class CinemaRepository : ICinemaRepository
{
    private readonly IDbContextFactory<CinemaDbContext> _factory;

    public CinemaRepository(IDbContextFactory<CinemaDbContext> factory)
    {
        _factory = factory;
    }


    public async Task<IReadOnlyList<Cinemas>> GetCinemasAsync()
    {
        CinemaDbContext db = await _factory.CreateDbContextAsync();
        return await db.Cinemas.ToListAsync();
    }
}