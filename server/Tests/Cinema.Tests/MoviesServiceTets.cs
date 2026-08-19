using Cinema.ControllerApi.DTOs;
using Cinema.ControllerApi.Services;
using Cinema.Data;
using Cinema.Data.Entities;
using FluentAssertions;
using Moq;

namespace Cinema.Tests.Unit;

public class MoviesServiceTests
{
	private readonly Mock<IMoviesRepository> _repository = new();
	private readonly MoviesService _sut;

	public MoviesServiceTests()
	{
		_sut = new MoviesService(_repository.Object);
	}

	[Fact]
	public async Task GetMoviesAsync_ReturnsMoviesFromRepository()
	{
		var movies = new List<Movies> { Movie(1, "Dune") };
		_repository.Setup(repository => repository.GetMoviesAsync()).ReturnsAsync(movies);

		var result = await _sut.GetMoviesAsync();

		result.Should().BeSameAs(movies);
		_repository.Verify(repository => repository.GetMoviesAsync(), Times.Once);
	}

	[Fact]
	public async Task GetAllMoviesAsync_ReturnsMoviesFromRepository()
	{
		var movies = new List<Movies> { Movie(1, "Dune"), Movie(2, "Mulan") };
		_repository.Setup(repository => repository.GetAllMoviesAsync()).ReturnsAsync(movies);

		var result = await _sut.GetAllMoviesAsync();

		result.Should().BeSameAs(movies);
		_repository.Verify(repository => repository.GetAllMoviesAsync(), Times.Once);
	}

	[Fact]
	public async Task SetMoviesAsync_WithValidData_DelegatesParsedValuesToRepository()
	{
		var request = new MovieCreateDto("Dune", "Fantasy", 150, "PG13", "Synopsis", "poster");
		var created = Movie(1, "Dune");
		_repository.Setup(repository => repository.SetMoviesAsync(
				"Dune", Genre.Fantasy, 150, Rating.PG13, "Synopsis", "poster"))
			.ReturnsAsync(created);

		var result = await _sut.SetMoviesAsync(request);

		result.Should().BeSameAs(created);
		_repository.Verify(repository => repository.SetMoviesAsync(
			"Dune", Genre.Fantasy, 150, Rating.PG13, "Synopsis", "poster"), Times.Once);
	}

	[Theory]
	[InlineData("")]
	[InlineData("UnknownGenre")]
	public async Task SetMoviesAsync_WithInvalidTitleOrGenre_ReturnsNullAndDoesNotCallRepository(string value)
	{
		var request = value == ""
			? new MovieCreateDto(value, "Fantasy", 150, "PG13", "Synopsis", "poster")
			: new MovieCreateDto("Dune", value, 150, "PG13", "Synopsis", "poster");

		var result = await _sut.SetMoviesAsync(request);

		result.Should().BeNull();
		_repository.Verify(repository => repository.SetMoviesAsync(
			It.IsAny<string>(), It.IsAny<Genre>(), It.IsAny<int>(), It.IsAny<Rating>(),
			It.IsAny<string>(), It.IsAny<string>()), Times.Never);
	}

	[Fact]
	public async Task SetMoviesAsync_WithInvalidRating_ReturnsNullAndDoesNotCallRepository()
	{
		var request = new MovieCreateDto("Dune", "Fantasy", 150, "UnknownRating", "Synopsis", "poster");

		var result = await _sut.SetMoviesAsync(request);

		result.Should().BeNull();
		_repository.Verify(repository => repository.SetMoviesAsync(
			It.IsAny<string>(), It.IsAny<Genre>(), It.IsAny<int>(), It.IsAny<Rating>(),
			It.IsAny<string>(), It.IsAny<string>()), Times.Never);
	}

	[Fact]
	public async Task UpdateMoviesAsync_WithValidData_DelegatesParsedValuesToRepository()
	{
		var request = new MoviesDTO(2, "Dune: Part Two", "Fantasy", "PG13",
			"Updated synopsis", 166, "updated-poster");
		var updated = Movie(2, "Dune: Part Two");
		_repository.Setup(repository => repository.UpdateMovieAsync(
				2, "Dune: Part Two", Genre.Fantasy, 166, Rating.PG13,
				"Updated synopsis", "updated-poster"))
			.ReturnsAsync(updated);

		var result = await _sut.UpdateMoviesAsync(request);

		result.Should().BeSameAs(updated);
		_repository.Verify(repository => repository.UpdateMovieAsync(
			2, "Dune: Part Two", Genre.Fantasy, 166, Rating.PG13,
			"Updated synopsis", "updated-poster"), Times.Once);
	}

	[Theory]
	[InlineData("")]
	[InlineData("UnknownGenre")]
	public async Task UpdateMoviesAsync_WithInvalidTitleOrGenre_ReturnsNullAndDoesNotCallRepository(string value)
	{
		var request = value == ""
			? new MoviesDTO(2, value, "Fantasy", "PG13", "Synopsis", 150, "poster")
			: new MoviesDTO(2, "Dune", value, "PG13", "Synopsis", 150, "poster");

		var result = await _sut.UpdateMoviesAsync(request);

		result.Should().BeNull();
		_repository.Verify(repository => repository.UpdateMovieAsync(
			It.IsAny<int>(), It.IsAny<string>(), It.IsAny<Genre>(), It.IsAny<int>(),
			It.IsAny<Rating>(), It.IsAny<string>(), It.IsAny<string>()), Times.Never);
	}

	[Fact]
	public async Task UpdateMoviesAsync_WithInvalidRating_ReturnsNullAndDoesNotCallRepository()
	{
		var request = new MoviesDTO(2, "Dune", "Fantasy", "UnknownRating", "Synopsis", 150, "poster");

		var result = await _sut.UpdateMoviesAsync(request);

		result.Should().BeNull();
		_repository.Verify(repository => repository.UpdateMovieAsync(
			It.IsAny<int>(), It.IsAny<string>(), It.IsAny<Genre>(), It.IsAny<int>(),
			It.IsAny<Rating>(), It.IsAny<string>(), It.IsAny<string>()), Times.Never);
	}

	[Theory]
	[InlineData(true)]
	[InlineData(false)]
	public async Task RemoveMovieAsync_ReturnsRepositoryResult(bool isRemoved)
	{
		_repository.Setup(repository => repository.RemoveMovieAsync(2)).ReturnsAsync(isRemoved);

		var result = await _sut.RemoveMovieAsync(2);

		result.Should().Be(isRemoved);
		_repository.Verify(repository => repository.RemoveMovieAsync(2), Times.Once);
	}

	private static Movies Movie(int id, string title) => new()
	{
		Movie_Id = id,
		Title = title,
		Genre = Genre.Fantasy,
		DurationMinutes = 150,
		Rating = Rating.PG13,
		Synopsis = "Synopsis",
		PosterUrl = "poster"
	};
}
