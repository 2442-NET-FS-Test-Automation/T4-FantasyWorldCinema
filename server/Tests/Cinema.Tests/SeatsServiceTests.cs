using Cinema.ControllerApi.Services;
using Cinema.Data;
using FluentAssertions;
using Moq;
using Xunit;

namespace Cinema.Tests.Unit.Services;

public class SeatsServiceTests
{
    private readonly Mock<ISeatsRepository> _mockRepo;
    private readonly SeatsService _service;

    public SeatsServiceTests()
    {
        _mockRepo = new Mock<ISeatsRepository>();
        _service = new SeatsService(_mockRepo.Object);
    }

    [Fact]
    public async Task GetSeatsByShowtimeAsync_ReturnsSeatsFromRepository()
    {
        // Arrange
        int showtimeId = 1;
        int roomId = 1;

        var expectedSeats = new List<(int Seat_Id, char Row, int Number, int IsFree)>
        {
            (1, 'A', 1, 0),
            (2, 'A', 2, 1)
        };

        _mockRepo
            .Setup(repo => repo.GetSeatsByShowtimeAsync(showtimeId, roomId))
            .ReturnsAsync(expectedSeats);

        // Act
        var result = await _service.GetSeatsByShowtimeAsync(showtimeId, roomId);

        // Assert
        result.Should().BeEquivalentTo(expectedSeats);
        _mockRepo.Verify(repo => repo.GetSeatsByShowtimeAsync(showtimeId, roomId), Times.Once);
    }
}
