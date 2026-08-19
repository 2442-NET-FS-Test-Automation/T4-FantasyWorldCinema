using Cinema.Data.Entities;
using Cinema.Data;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Xunit;

namespace Cinema.Tests.Integration;

public class CustomWebApplicationFactory<TProgram>
    :  WebApplicationFactory<TProgram> where TProgram : class 
{
    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureServices(services =>
        {
            var efDescriptors = services
                .Where(d => d.ServiceType.Namespace != null && 
                            d.ServiceType.Namespace.StartsWith("Microsoft.EntityFrameworkCore"))
                .ToList();

            foreach (var descriptor in efDescriptors)
            {
                services.Remove(descriptor);
            }

            services.AddDbContextFactory<CinemaDbContext>(options =>
            {
                options.UseInMemoryDatabase("InMemoryDbForTesting");
            });

            // Mock Hangfire IBackgroundJobClient
            var hangfireDescriptor = services.SingleOrDefault(d => d.ServiceType == typeof(Hangfire.IBackgroundJobClient));
            if (hangfireDescriptor != null)
            {
                services.Remove(hangfireDescriptor);
            }
            services.AddSingleton(new Moq.Mock<Hangfire.IBackgroundJobClient>().Object);
        });

        builder.UseEnvironment("Development");
    }

    public void ResetDatabase()
    {
        using var scope = Services.CreateScope();

        var factory = scope.ServiceProvider
            .GetRequiredService<IDbContextFactory<CinemaDbContext>>();

        using var db = factory.CreateDbContext();

        db.TransactionSeats.RemoveRange(db.TransactionSeats);
        db.Transactions.RemoveRange(db.Transactions);
        db.Showtimes.RemoveRange(db.Showtimes);
        db.Seats.RemoveRange(db.Seats);
        db.Rooms.RemoveRange(db.Rooms);
        db.Movies.RemoveRange(db.Movies);

        db.SaveChanges();
    }

    protected override IHost CreateHost(IHostBuilder builder)
    {
        var host = base.CreateHost(builder);

        using var scope = host.Services.CreateScope();
        var factory = scope.ServiceProvider.GetRequiredService<IDbContextFactory<CinemaDbContext>>();
        using var db = factory.CreateDbContext();

        db.Database.EnsureCreated();
        
        if (db.Showtimes.Any())
        {
            db.Showtimes.RemoveRange(db.Showtimes);
            db.SaveChanges();
        }

        return host;
    }

}

[CollectionDefinition("Cinema API")]
public class CinemaApiCollection : ICollectionFixture<CustomWebApplicationFactory<Program>>{}