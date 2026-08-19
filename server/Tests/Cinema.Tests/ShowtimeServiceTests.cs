using AutoMapper;
using FluentAssertions;
using Cinema.ControllerApi.Services;
using Cinema.Data.Entities;
using Cinema.Tests.Unit.Fixtures;
using Microsoft.AspNetCore.Mvc;
using Cinema.ControllerApi.DTOs;
using Moq;
using Cinema.Data;

namespace Cinema.Tests.Unit;

public class ShowtimeServiceTests : IClassFixture<MapperFixture>
{
    private readonly Mock<IShowtimeRepository> _repo;
    

    public ShowtimeServiceTests()
    {
        _repo = new Mock<IShowtimeRepository>();
    }
    private static Showtimes Item(int showtime_Id, string movie, string poster, Rating rating, string room,
        int room_Id, DateOnly showDate, TimeOnly startTime, TimeOnly endTime, decimal price)
    {
        return new() {Showtime_Id = showtime_Id, Movie = new Movies {Title = movie, PosterUrl = poster, Rating = rating}, 
            Room = new Rooms{Room_Id = room_Id, RoomName = room}, ShowDate = showDate, StartTime = startTime,
            EndTime = endTime, Price = price};
    }

    [Fact]
    public async Task IsShowtimeValid_ReturnsAShowtimeWithValidId()
    {
        // Arrange
        List<Showtimes> myShowtimes = new List<Showtimes>();
        myShowtimes.Add(Item(1, "Mulan", "URL-X", Rating.G, "General", 1, new DateOnly(2026, 08, 20),
            new TimeOnly(20,45), new TimeOnly(23,0), 4.9m));
        myShowtimes.Add(Item(2, "Dune", "URL-X", Rating.R, "General", 2, new DateOnly(2026, 08, 20),
            new TimeOnly(20,45), new TimeOnly(23,0), 4.9m));
        myShowtimes.Add(Item(3, "X-Men", "URL-X", Rating.R, "General", 3, new DateOnly(2026, 08, 20),
            new TimeOnly(20,45), new TimeOnly(23,0), 4.9m));

        _repo.Setup(r => r.GetShowtimeById(1))
            .ReturnsAsync(Item(1, "Mulan", "URL-X", Rating.G, "General", 1, new DateOnly(2026, 08, 20),
            new TimeOnly(20,45), new TimeOnly(23,0), 4.9m));

        ShowtimeService sut = new ShowtimeService(_repo.Object);
    
        // Act
        var response = await sut.IsShowtimeValid(1);
    
        // Assert
        response.Should().BeOfType<Showtimes>();
        response.Movie.Title.Should().Be("Mulan");
    }

    [Fact]
    public async Task IsShowtimeValid_ReturnsANullWithInvalidId()
    {
        _repo.Setup(r => r.GetShowtimeById(0))
            .ReturnsAsync((Showtimes?)null);

        ShowtimeService sut = new ShowtimeService(_repo.Object);
    
        // Act
        var response = await sut.IsShowtimeValid(4);
    
        // Assert
        response.Should().BeNull();
    }

}