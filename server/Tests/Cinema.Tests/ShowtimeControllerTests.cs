using AutoMapper;
using FluentAssertions;
using Cinema.ControllerApi.Services;
using Cinema.Data.Entities;
using Cinema.Tests.Unit.Fixtures;
using Microsoft.AspNetCore.Mvc;
using Cinema.ControllerApi.DTOs;
using Moq;

namespace Cinema.Tests.Unit;

public class ShowtimeControllerTests : IClassFixture<MapperFixture>
{
    private readonly Mock<IShowtimeService> _service = new();
    private readonly IMapper _mapper;
    private Dictionary<int, Showtimes> myShowtimes {get; set; } = new();

    public ShowtimeControllerTests(MapperFixture mapper)
    {
        _mapper = mapper.Mapper;

        // Seed showtimes data
        myShowtimes.Add(1, Item(1, "Mulan", "URL-X", Rating.G, "General", 1, new DateOnly(2026, 08, 20),
            new TimeOnly(20,45), new TimeOnly(23,0), 4.9m));
        myShowtimes.Add(2, Item(2, "Dune", "URL-X", Rating.R, "General", 2, new DateOnly(2026, 08, 20),
            new TimeOnly(20,45), new TimeOnly(23,0), 4.9m));
        myShowtimes.Add(3, Item(3, "X-Men", "URL-X", Rating.R, "General", 3, new DateOnly(2026, 08, 20),
            new TimeOnly(20,45), new TimeOnly(23,0), 4.9m));
        myShowtimes.Add(4, Item(4, "Minions", "URL-X", Rating.G, "General", 1, new DateOnly(2026, 08, 1),
            new TimeOnly(20,45), new TimeOnly(23,0), 4.9m));
        myShowtimes.Add(5, Item(5, "Spider Man", "URL-X", Rating.PG13, "General", 2, new DateOnly(2026, 08, 2),
            new TimeOnly(20,45), new TimeOnly(23,0), 4.9m));
    }

    private ShowtimeController CreateSut() => 
        new(_service.Object, _mapper);
    
    private static Showtimes Item(int showtime_Id, string movie, string poster, Rating rating, string room,
        int room_Id, DateOnly showDate, TimeOnly startTime, TimeOnly endTime, decimal price)
    {
        return new() {Showtime_Id = showtime_Id, Movie = new Movies {Title = movie, PosterUrl = poster, Rating = rating}, 
            Room = new Rooms{Room_Id = room_Id, RoomName = room}, ShowDate = showDate, StartTime = startTime,
            EndTime = endTime, Price = price};
    } 
        
    
    [Fact]
    public async Task ShowtimeGet_ReturnsOkWithMappedDtos()
    {
        // Arreange
        _service.Setup(s => s.GetAllShowtimesAsync())
            .ReturnsAsync(myShowtimes.Values.ToList());
        
        ShowtimeController sut = CreateSut();

        // Act 
        var result = await sut.GetAllShowtimesAsync();

        // Assert
        var ok = result.Result.Should().BeOfType<OkObjectResult>().Subject;
        ok.StatusCode.Should().Be(200);

        var returnedItems = ok.Value.Should().BeAssignableTo<List<ShowtimeDto>>().Subject;

        returnedItems.Should().HaveCount(5);
        returnedItems.Should().BeEqualTo(_mapper.Map<IEnumerable<ShowtimeDto>>(myShowtimes.Values.ToList()));
    }

}