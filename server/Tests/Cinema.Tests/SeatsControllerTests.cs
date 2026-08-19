using AutoMapper;
using Cinema.ControllerApi.Controllers;
using Cinema.ControllerApi.DTOs;
using Cinema.ControllerApi.Services;
using Cinema.Tests.Unit.Fixtures;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace Cinema.Tests.Unit.Controllers;

public class SeatsControllerTests : IClassFixture<MapperFixture>
{
    private readonly Mock<ISeatsService> _mockService;
    private readonly IMapper _mapper;
    private readonly SeatsController _controller;

    public SeatsControllerTests(MapperFixture fixture)
    {
        _mockService = new Mock<ISeatsService>();
        _mapper = fixture.Mapper;
        _controller = new SeatsController(_mockService.Object, _mapper);
    }

    [Fact]
    public async Task TC12_GetSeats_WithMixOfBookedAndAvailable_Returns200AndMappedSeats()
    {
        // Arrange
        int showtimeId = 1;
        int roomId = 1;

        // IsFree: 0 = Available, 1 = Occupied (as per repository logic)
        var mockSeats = new List<(int Seat_Id, char Row, int Number, int IsFree)>
        {
            (1, 'A', 1, 0), // Available
            (2, 'A', 2, 1), // Occupied
            (3, 'A', 3, 1), // Occupied
            (4, 'A', 4, 0)  // Available
        };

        _mockService
            .Setup(s => s.GetSeatsByShowtimeAsync(showtimeId, roomId))
            .ReturnsAsync(mockSeats);

        // Act
        var result = await _controller.GetSeatsByShowtimeAsync(showtimeId, roomId);

        // Assert
        var okResult = result.Result.Should().BeOfType<OkObjectResult>().Subject;
        var returnedSeats = okResult.Value.Should().BeAssignableTo<IEnumerable<SeatsDTO>>().Subject.ToList();

        returnedSeats.Should().HaveCount(4);
        
        // Assert specific seats
        returnedSeats.Single(s => s.Seat_Id == 1).IsFree.Should().Be(0, "because it is available");
        returnedSeats.Single(s => s.Seat_Id == 2).IsFree.Should().Be(1, "because it is booked/occupied");
        returnedSeats.Single(s => s.Seat_Id == 3).IsFree.Should().Be(1, "because it is booked/occupied");
        returnedSeats.Single(s => s.Seat_Id == 4).IsFree.Should().Be(0, "because it is available");
    }

    [Fact]
    public async Task TC29_GetSeats_WhenCinemaIsCompletelyFull_Returns200AndAllOccupied()
    {
        // Arrange
        int showtimeId = 2;
        int roomId = 2;

        var mockSeats = new List<(int Seat_Id, char Row, int Number, int IsFree)>
        {
            (1, 'B', 1, 1), // Occupied
            (2, 'B', 2, 1), // Occupied
            (3, 'B', 3, 1), // Occupied
            (4, 'B', 4, 1)  // Occupied
        };

        _mockService
            .Setup(s => s.GetSeatsByShowtimeAsync(showtimeId, roomId))
            .ReturnsAsync(mockSeats);

        // Act
        var result = await _controller.GetSeatsByShowtimeAsync(showtimeId, roomId);

        // Assert
        var okResult = result.Result.Should().BeOfType<OkObjectResult>().Subject;
        var returnedSeats = okResult.Value.Should().BeAssignableTo<IEnumerable<SeatsDTO>>().Subject.ToList();

        returnedSeats.Should().HaveCount(4);
        returnedSeats.All(s => s.IsFree == 1).Should().BeTrue("because every single seat has been sold (Occupied = 1)");
    }

    [Fact]
    public async Task TC30_GetSeats_WhenCinemaIsCompletelyEmpty_Returns200AndAllAvailable()
    {
        // Arrange
        int showtimeId = 3;
        int roomId = 3;

        var mockSeats = new List<(int Seat_Id, char Row, int Number, int IsFree)>
        {
            (1, 'C', 1, 0), // Available
            (2, 'C', 2, 0), // Available
            (3, 'C', 3, 0), // Available
            (4, 'C', 4, 0)  // Available
        };

        _mockService
            .Setup(s => s.GetSeatsByShowtimeAsync(showtimeId, roomId))
            .ReturnsAsync(mockSeats);

        // Act
        var result = await _controller.GetSeatsByShowtimeAsync(showtimeId, roomId);

        // Assert
        var okResult = result.Result.Should().BeOfType<OkObjectResult>().Subject;
        var returnedSeats = okResult.Value.Should().BeAssignableTo<IEnumerable<SeatsDTO>>().Subject.ToList();

        returnedSeats.Should().HaveCount(4);
        returnedSeats.All(s => s.IsFree == 0).Should().BeTrue("because the showtime is newly created with 0 transactions (Available = 0)");
    }
}
