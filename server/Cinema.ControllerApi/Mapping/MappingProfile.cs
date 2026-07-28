using AutoMapper;
using Cinema.ControllerApi.DTOs;
using Cinema.Data.Entities;
using Cinema.Data.Extensions;

namespace Cinema.ControllerApi.Mapping;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // Map Showtimes by Cinema
        CreateMap<Showtimes, ShowtimeDto>()
            .ForCtorParam("Showtime_Id", o => o.MapFrom(s => s.Showtime_Id))
            .ForCtorParam("Movie", o => o.MapFrom(s => s.Movie.Title))
            .ForCtorParam("Poster", o => o.MapFrom(s => s.Movie.PosterUrl))
            .ForCtorParam("Room", o => o.MapFrom(s => s.Room.RoomName))
            .ForCtorParam("Rating", o => o.MapFrom(s => s.Movie.Rating.GetDescription()))
            .ForCtorParam("Room_Id", o => o.MapFrom(s => s.Room.Room_Id))
            .ForCtorParam("ShowDate", o => o.MapFrom(s => s.ShowDate))
            .ForCtorParam("StartTime", o => o.MapFrom(s => s.StartTime))
            .ForCtorParam("EndTime", o => o.MapFrom(s => s.EndTime))
            .ForCtorParam("Price", o => o.MapFrom(s => s.Price))
            .ForCtorParam("Rating", o => o.MapFrom(s => s.Movie.Rating.ToString()))
            .ForCtorParam("Poster", o => o.MapFrom(s => s.Movie.PosterUrl));

        // Map Seats by Showtime
        CreateMap<(int Seat_Id, char Row, int Number, int IsFree), SeatsDTO>()
            .ForCtorParam("Seat_Id", o => o.MapFrom(s => s.Seat_Id))
            .ForCtorParam("Row", o => o.MapFrom(s => s.Row))
            .ForCtorParam("Number", o => o.MapFrom(s => s.Number))
            .ForCtorParam("IsFree", o => o.MapFrom(s => s.IsFree));

        // Map Simple Cinemas
        CreateMap<Cinemas, SimpleCinemaDto>()
            .ForCtorParam("Cinema_Id", o => o.MapFrom(s => s.Cinema_Id))
            .ForCtorParam("CinemaName", o => o.MapFrom(s => s.CinemaName))
            .ForCtorParam("CinemaCity", o => o.MapFrom(s => s.City.GetDescription()));
        
        // Map Movies
        CreateMap<Movies, MoviesDTO>()
            .ForCtorParam("Movie_Id", o => o.MapFrom(s => s.Movie_Id))
            .ForCtorParam("Title", o => o.MapFrom(s => s.Title))
            .ForCtorParam("Genre", o => o.MapFrom(s => s.Genre))
            .ForCtorParam("Rating", o => o.MapFrom(s => s.Rating))
            .ForCtorParam("Synopsis", o => o.MapFrom(s => s.Synopsis))
            .ForCtorParam("DurationMinutes", o => o.MapFrom(s => s.DurationMinutes))
            .ForCtorParam("Poster", o => o.MapFrom(s => s.PosterUrl));
        
        CreateMap<MoviesDTO, Movies>()
            .ForCtorParam("Movie_Id", o => o.MapFrom(s => s.Movie_Id))
            .ForCtorParam("Title", o => o.MapFrom(s => s.Title))
            .ForCtorParam("Genre", o => o.MapFrom(s => s.Genre))
            .ForCtorParam("Rating", o => o.MapFrom(s => s.Rating))
            .ForCtorParam("Synopsis", o => o.MapFrom(s => s.Synopsis))
            .ForCtorParam("DurationMinutes", o => o.MapFrom(s => s.DurationMinutes))
            .ForCtorParam("PosterUrl", o => o.MapFrom(s => s.Poster));
    }
}