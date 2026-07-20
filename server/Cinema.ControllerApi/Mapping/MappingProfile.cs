using AutoMapper;
using Cinema.ControllerApi.DTOs;
using Cinema.Data.Entities;

namespace Cinema.ControllerApi.Mapping;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<Showtimes, ShowtimeDto>()
            .ForCtorParam("Showtime_Id", o => o.MapFrom(s => s.Showtime_Id))
            .ForCtorParam("Movie", o => o.MapFrom(s => s.Movie.Title))
            .ForCtorParam("Room", o => o.MapFrom(s => s.Room.RoomName))
            .ForCtorParam("ShowDate", o => o.MapFrom(s => s.ShowDate))
            .ForCtorParam("StartTime", o => o.MapFrom(s => s.StartTime))
            .ForCtorParam("EndTime", o => o.MapFrom(s => s.EndTime))
            .ForCtorParam("Price", o => o.MapFrom(s => s.Price));
    }
}