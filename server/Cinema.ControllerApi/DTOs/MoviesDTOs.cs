namespace Cinema.ControllerApi.DTOs;

public record MoviesDTO(int Movie_Id, string Title, string Genre, string Rating,
    string Synopsis, int DurationMinutes);