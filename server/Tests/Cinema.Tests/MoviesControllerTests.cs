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

        myMovies.Add(1, Item())
        
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


}