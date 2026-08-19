using Cinema.Data.Entities;
using System.ComponentModel.DataAnnotations;

namespace Cinema.ControllerApi.DTOs;

public record MoviesDTO(int Movie_Id, [Required] string Title, string Genre, string Rating,
    string Synopsis, int DurationMinutes, string Poster);

public record MovieCreateDto([Required] string Title, string Genre, int DurationMinutes, 
    string Rating, string Synopsis, string Poster);