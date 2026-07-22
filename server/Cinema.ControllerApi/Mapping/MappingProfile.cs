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
            .ForCtorParam("Room", o => o.MapFrom(s => s.Room.RoomName))
            .ForCtorParam("Room_Id", o => o.MapFrom(s => s.Room.Room_Id))
            .ForCtorParam("ShowDate", o => o.MapFrom(s => s.ShowDate))
            .ForCtorParam("StartTime", o => o.MapFrom(s => s.StartTime))
            .ForCtorParam("EndTime", o => o.MapFrom(s => s.EndTime))
            .ForCtorParam("Price", o => o.MapFrom(s => s.Price));

        // Map Seats by Showtime
        CreateMap<(int Seat_Id, char Row, int Number, Status LastTransaction), SeatsDTO>()
            .ForCtorParam("Seat_Id", o => o.MapFrom(s => s.Seat_Id))
            .ForCtorParam("Row", o => o.MapFrom(s => s.Row))
            .ForCtorParam("Number", o => o.MapFrom(s => s.Number))
            .ForCtorParam("IsFree", o => o.MapFrom(s => s.LastTransaction));

        // Map Simple Cinemas
        CreateMap<Cinemas, SimpleCinemaDto>()
            .ForCtorParam("Cinema_Id", o => o.MapFrom(s => s.Cinema_Id))
            .ForCtorParam("CinemaName", o => o.MapFrom(s => s.CinemaName))
            .ForCtorParam("CinemaCity", o => o.MapFrom(s => s.City.GetDescription()));

    }
}