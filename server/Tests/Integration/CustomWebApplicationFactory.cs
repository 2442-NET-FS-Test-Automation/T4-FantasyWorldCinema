using Cinema.Data.Entities;
using Cinema.Data;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace Cinema.Tests.Integration;

public class CustomWebApplicationFactory<TProgram>
    : WebApplicationFactory<TProgram> where TProgram : class
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

            var serviceProvider = services.BuildServiceProvider();

            using var scope = serviceProvider.CreateScope();

            var factory = scope.ServiceProvider
                .GetRequiredService<IDbContextFactory<CinemaDbContext>>();
            
            using var db =  factory.CreateDbContext();

            // Create the database
            db.Database.EnsureCreated();

            // Seed the database
            SeedDatabase(db);

        });

        builder.UseEnvironment("Development");
    }

     private static void SeedDatabase(CinemaDbContext db)
    {
        db.Movies.AddRange(
            new Movies {
                Movie_Id = 1,
                Title = "Mulan",
                Genre = Genre.Animation,
                DurationMinutes = 120,
                Rating = Rating.G,
                Synopsis = "Synopsis 1",
                PosterUrl = "URL-X"
            },
            new Movies {
                Movie_Id = 2,
                Title = "Dune",
                Genre = Genre.Fantasy,
                DurationMinutes = 150,
                Rating = Rating.PG13,
                Synopsis = "Synopsis 2",
                PosterUrl = "URL-X"
            },
            new Movies {
                Movie_Id = 3,
                Title = "Titanic",
                Genre = Genre.Comedy,
                DurationMinutes = 180,
                Rating = Rating.R,
                Synopsis = "Synopsis 3",
                PosterUrl = "URL-X"
            }
        );

        db.Cinemas.AddRange(
            new Cinemas{
                Cinema_Id = 1,
                CinemaName = "FAWO Gudalajara",
                Address = "Hidalgo #1",
                City = City.Guadalajara
            },
            new Cinemas{
                Cinema_Id = 2,
                CinemaName = "FAWO Tijuana",
                Address = "Francisco I. Madero #2",
                City = City.Tijuana
            },
            new Cinemas{
                Cinema_Id = 3,
                CinemaName = "FAWO Cancun",
                Address = "Playa Perdida #15",
                City = City.Cancun
            }
        );

        db.Rooms.AddRange(
            new Rooms{
                    Room_Id = 1,
                    RoomName = "General 1",
                    Cinema_Id = 1,
                    Capacity = 25
            },
            new Rooms{
                    Room_Id = 2,
                    RoomName = "General 2",
                    Cinema_Id = 1,
                    Capacity = 25
            },
            new Rooms{
                    Room_Id = 3,
                    RoomName = "IMAX",
                    Cinema_Id = 1,
                    Capacity = 25
            }
        );

        db.Showtimes.AddRange(
            new Showtimes
            {
                Showtime_Id = 1,
                Movie_Id = 1,
                Room_Id = 1,
                ShowDate = DateOnly.FromDateTime(DateTime.Now).AddDays(-1),
                StartTime = new TimeOnly(20, 45),
                EndTime = new TimeOnly(23, 0),
                Price = 4.9m
            },

            new Showtimes
            {
                Showtime_Id = 2,
                Movie_Id = 2,
                Room_Id = 1,
                ShowDate = DateOnly.FromDateTime(DateTime.Now).AddDays(-1),
                StartTime = new TimeOnly(20, 45),
                EndTime = new TimeOnly(23, 0),
                Price = 4.9m
            },

            new Showtimes
            {
                Showtime_Id = 3,
                Movie_Id = 3,
                Room_Id = 1,
                ShowDate = DateOnly.FromDateTime(DateTime.Now).AddDays(-1),
                StartTime = new TimeOnly(20, 45),
                EndTime = new TimeOnly(23, 0),
                Price = 4.9m
            }
        );

        db.Roles.AddRange(
            new Roles { Role_Id = 1, RoleName = "Admin"},
            new Roles { Role_Id = 2, RoleName = "Consumer"}
        );

        int seatId = 1;
        for (int room = 1; room <= 3; room++)
        {
            for (int row = 1; row  <= 5; row++)
            {
                char RW = (char)('A' + row - 1);
                for (int num = 1; num <= 5; num++)
                {
                    db.Seats.Add(new Seats
                    {
                        Seat_Id = seatId,
                        Room_Id = room,
                        Row = RW,
                        Number = num
                    });
                    seatId++;
                }
            }
        }

        db.Users.AddRange(
            new Users { 
                User_Id = 1, 
                Username = "Fran34J", 
                Email = "Fran@mail.com", 
                PasswordHash = "$argon2id$v=19$m=65536,t=4,p=8$aFQxVzBGWEQwVnprM2lHbw$crbzfKlT7lflD3QFxH0LSUGapiuoY3Nu2an3OvFvXbQ", 
                FullName = "Francesco Totti", 
                Role_Id = 2,
                 CreatedAt = new DateTime(2026, 07, 20)},
            new Users { 
                User_Id = 2, 
                Username = "Rob94", 
                Email = "Rob@mail.com", 
                PasswordHash = "$argon2id$v=19$m=65536,t=4,p=8$dHlRS1M2Qng2eVl6a016eg$OoY2yrwFm6MC0wGW5cOWzmFloe9i9/cKb+wUeTl1Mik", 
                FullName = "Roberto Baggio", 
                Role_Id = 1, 
                CreatedAt = new DateTime(2026, 07, 20)}
        );

        db.SaveChanges();
    }
}

[CollectionDefinition("Cinema API")]
public class CinemaApiCollection : ICollectionFixture<CustomWebApplicationFactory<Program>>{}
