using AutoMapper;
using Cinema.ControllerApi.DTOs;
using Cinema.ControllerApi.Services;
using Cinema.Data;
using Cinema.Data.Entities;
using FluentAssertions;
using Hangfire;
using Moq;
using Xunit;

namespace Cinema.Tests.Unit;

public class TransactionServiceTests
{
    private readonly Mock<ITransactionRepository> _mockTransactionRepo;
    private readonly Mock<ISeatsRepository> _mockSeatsRepo;
    private readonly Mock<IShowtimeService> _mockShowtimeService;
    private readonly Mock<IMapper> _mockMapper;
    private readonly Mock<IBackgroundJobClient> _mockBackgroundJobClient;
    private readonly TransactionService _sut;

    public TransactionServiceTests()
    {
        _mockTransactionRepo = new Mock<ITransactionRepository>();
        _mockSeatsRepo = new Mock<ISeatsRepository>();
        _mockShowtimeService = new Mock<IShowtimeService>();
        _mockMapper = new Mock<IMapper>();
        _mockBackgroundJobClient = new Mock<IBackgroundJobClient>();

        _sut = new TransactionService(
            _mockTransactionRepo.Object,
            _mockSeatsRepo.Object,
            _mockShowtimeService.Object,
            _mockMapper.Object,
            _mockBackgroundJobClient.Object
        );
    }

    [Fact]
    public async Task TC13_CreateAsync_WhenSeatAlreadyTaken_ReturnsBadRequest()
    {
        // Arrange
        int userId = 1;
        var requestDto = new CreateTransactionDto 
        { 
            ShowtimeId = 1, 
            SeatIds = new List<int> { 1 } 
        };
        var showtime = new Showtimes { Showtime_Id = 1, Price = 10m };
        
        _mockShowtimeService.Setup(s => s.IsShowtimeValid(requestDto.ShowtimeId))
            .ReturnsAsync(showtime);
        
        // Simulating the seat is occupied or invalid
        _mockSeatsRepo.Setup(r => r.AreSeatsOccupiedAsync(requestDto.ShowtimeId, requestDto.SeatIds))
            .ReturnsAsync(true);

        // Act
        var result = await _sut.CreateAsync(userId, requestDto);

        // Assert
        result.IsSuccess.Should().BeFalse();
        result.ErrorType.Should().Be(ErrorType.BadRequest);
        result.ErrorMessage.Should().Be("Selected seats are not valid.");
    }

    [Fact]
    public async Task TC26_CreateAsync_WhenSeatIsOutOfBounds_ReturnsBadRequest()
    {
        // Arrange
        int userId = 1;
        var requestDto = new CreateTransactionDto 
        { 
            ShowtimeId = 1, 
            SeatIds = new List<int> { 99 } 
        };
        var showtime = new Showtimes { Showtime_Id = 1, Price = 10m };

        _mockShowtimeService.Setup(s => s.IsShowtimeValid(requestDto.ShowtimeId))
            .ReturnsAsync(showtime);

        // Simulating out of bounds validSeats verification fails
        _mockSeatsRepo.Setup(r => r.AreSeatsOccupiedAsync(requestDto.ShowtimeId, requestDto.SeatIds))
            .ReturnsAsync(true);

        // Act
        var result = await _sut.CreateAsync(userId, requestDto);

        // Assert
        result.IsSuccess.Should().BeFalse();
        result.ErrorType.Should().Be(ErrorType.BadRequest);
        result.ErrorMessage.Should().Be("Selected seats are not valid.");
    }
    [Fact]
    public async Task TC14_CreateAsync_HappyPath_ReturnsSuccessAndPendingStatus()
    {
        // Arrange
        int userId = 14;
        var requestDto = new CreateTransactionDto 
        { 
            ShowtimeId = 1, 
            SeatIds = new List<int> { 1, 2 } 
        };
        var showtime = new Showtimes { Showtime_Id = 1, Price = 10m };

        _mockShowtimeService.Setup(s => s.IsShowtimeValid(requestDto.ShowtimeId))
            .ReturnsAsync(showtime);

        _mockSeatsRepo.Setup(r => r.AreSeatsOccupiedAsync(requestDto.ShowtimeId, requestDto.SeatIds))
            .ReturnsAsync(false);

        var savedEntity = new Transactions { Transaction_Id = 123, Status = Status.Pending };
        _mockTransactionRepo.Setup(r => r.CreateTransactionAsync(It.IsAny<Transactions>()))
            .ReturnsAsync(savedEntity);

        var createdTransaction = new Transactions { Transaction_Id = 123, Status = Status.Pending };
        _mockTransactionRepo.Setup(r => r.GetTransactionWithDetailsAsync(savedEntity.Transaction_Id))
            .ReturnsAsync(createdTransaction);

        var responseDto = new TransactionResponseDto { TransactionId = 123, Status = "Pending" };
        _mockMapper.Setup(m => m.Map<TransactionResponseDto>(createdTransaction))
            .Returns(responseDto);

        // Act
        var result = await _sut.CreateAsync(userId, requestDto);

        // Assert
        result.IsSuccess.Should().BeTrue();
        result.Data.Should().NotBeNull();
        result.Data!.TransactionId.Should().Be(123);
        result.Data.Status.Should().Be("Pending");
    }
}
