using AutoMapper;
using FluentAssertions;
using Cinema.ControllerApi.Mapping;
using Cinema.ControllerApi.Services;
using Cinema.Data.Entities;
using Cinema.Tests.Unit.Fixtures;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging.Abstractions;
using Cinema.ControllerApi.DTOs;
using Moq;

namespace Cinema.Tests.Unit;

public class ShowtimeControllerTests : IClassFixture<MapperFixture>
{
    private readonly Mock<IShowtimeService> _service = new();
    private readonly IMapper _mapper;

    public ShowtimeControllerTests(MapperFixture mapper)
    {
        _mapper = mapper.Mapper;
    }

    private ShowtimeController CreateSut() => 
        new(_service.Object, _mapper);
}