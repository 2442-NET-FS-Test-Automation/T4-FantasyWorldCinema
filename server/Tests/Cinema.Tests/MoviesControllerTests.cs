using AutoMapper;
using FluentAssertions;
using Cinema.ControllerApi.Services;
using Cinema.Data.Entities;
using Cinema.Tests.Unit.Fixtures;
using Microsoft.AspNetCore.Mvc;
using Cinema.ControllerApi.DTOs;
using Moq;

namespace Cinema.Tests.Unit;

public class MoviesControllerTests: IClassFixture<MapperFixture>
{
    private readonly Mock<IMoviesService> _service = new();
    private readonly IMapper _mapper;

    public Dictionary<int, Movies> myMovies {get; set; } = new();

    public MoviesControllerTests(MapperFixture mapper)
    {
        _mapper = mapper.Mapper;

        myMovies.Add(1, Item(1, "Minions", Genre.Animation, 150, Rating.G, "Minions synopsis", 
            "some URL"));
        myMovies.Add(2, Item(2, "SHREK", Genre.Animation, 120, Rating.PG, "Minions synopsis", 
            "some URL"));
        myMovies.Add(3, Item(3, "Titanic", Genre.Comedy, 180, Rating.PG13, "Minions synopsis", 
            "some URL"));
        
    }
    private MoviesController CreateSut() => 
        new(_service.Object, _mapper);

    private static Movies Item(int movie_Id, string title, Genre genre, int durationMinutes,
        Rating rating, string synopsis, string posterUrl)
    {
        return new()
        {
            Movie_Id = movie_Id, Title = title, Genre = genre,
            DurationMinutes = durationMinutes, Rating = rating,
            Synopsis = synopsis, PosterUrl = posterUrl
        };
    }

    [Fact]
    public async Task MoviesGet_ReturnsOkWithMappedDtos()
    {
        // Arrange
        _service.Setup(s => s.GetAllMoviesAsync())
            .ReturnsAsync(myMovies.Values.ToList());
        
        MoviesController sut = CreateSut();

        // Act
        var result = await sut.GetAllMoviesAsync();

        // Assert
        var ok = result.Result.Should().BeOfType<OkObjectResult>().Subject;
        ok.StatusCode.Should().Be(200);

         var returnedItems = ok.Value.Should().BeAssignableTo<List<MoviesDTO>>().Subject;

         returnedItems.Should().HaveCount(3);
         returnedItems.Should().BeEqualTo(_mapper.Map<IEnumerable<MoviesDTO>>(myMovies.Values.ToList()));
    }


}