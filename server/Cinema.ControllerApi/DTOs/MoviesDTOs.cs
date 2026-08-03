using Cinema.Data.Entities;

namespace Cinema.ControllerApi.DTOs;

public record MoviesDTO(int Movie_Id, string Title, string Genre, string Rating,
    string Synopsis, int DurationMinutes, string Poster);

public record MovieCreateDto(string Title, string Genre, int DurationMinutes, 
    string Rating, string Synopsis, string Poster);