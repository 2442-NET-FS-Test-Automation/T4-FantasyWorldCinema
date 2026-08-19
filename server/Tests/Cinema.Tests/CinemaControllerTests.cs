using AutoMapper;
using FluentAssertions;
using Cinema.ControllerApi.Services;
using Cinema.Data.Entities;
using Cinema.Tests.Unit.Fixtures;
using Microsoft.AspNetCore.Mvc;
using Cinema.ControllerApi.DTOs;
using Moq;

namespace Cinema.Tests.Unit;

public class CinemaControllerTests : IClassFixture<MapperFixture>
{
    private readonly Mock<ICinemaService> _service = new();
    private readonly IMapper _mapper;
    private List<Cinemas> myCinemas {get; set; } = new();

    public CinemaControllerTests(MapperFixture mapper)
    {
        _mapper = mapper.Mapper;

        myCinemas.Add(Item(1, "Guadalajara", "Hidalgo #1", City.Guadalajara));
        myCinemas.Add(Item(2, "Tijuana", "Juarez #1", City.Tijuana));
        myCinemas.Add(Item(3, "Acapulco", "Playa Tranquila #1", City.Acapulco));
        myCinemas.Add(Item(4, "Celaya", "Revolucion #1", City.Celaya));
        myCinemas.Add(Item(5, "Chihuahua", "Francisco Villa #1", City.Chihuahua));
        
    }

    private CinemaController CreateSut() => 
        new(_service.Object, _mapper);
    
    private static Cinemas Item(int cinema_Id, string name, string address, City city)
    {
        return new() {Cinema_Id = cinema_Id, CinemaName = name, Address = address, City = city};
    }
    
    [Fact]
    public async Task GetCinemas_ReturnsMappedDtos()
    {
        // Arrange
        _service.Setup(s => s.GetCinemasAsync())
            .ReturnsAsync(myCinemas);

        CinemaController sut = CreateSut();

        // Act
        var response = await sut.GetCinemas();

        // Assert
        var ok = response.Result.Should().BeOfType<OkObjectResult>().Subject;
        ok.StatusCode.Should().Be(200);

        var returnedItems = ok.Value.Should().BeAssignableTo<List<SimpleCinemaDto>>().Subject;

        returnedItems.Should().HaveCount(5);
        returnedItems.Should().BeEqualTo(_mapper.Map<IEnumerable<SimpleCinemaDto>>(myCinemas));
    }
}