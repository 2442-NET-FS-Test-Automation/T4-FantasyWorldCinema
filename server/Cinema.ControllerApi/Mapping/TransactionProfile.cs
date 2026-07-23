using AutoMapper;
using Cinema.Data.Entities;
using Cinema.ControllerApi.DTOs;

public class TransactionProfile : Profile
{
    public TransactionProfile()
    {
        CreateMap<Transactions, TransactionResponseDto>()

            // Explicit Mapping for ID
            .ForMember(dest => dest.TransactionId, 
                   opt => opt.MapFrom(src => src.Transaction_Id))

            // Mapping from Enum Status to string.
            .ForMember(dest => dest.Status, 
                       opt => opt.MapFrom(src => src.Status.ToString()))

            // Movie title through Showtime
            .ForMember(dest => dest.MovieTitle, 
                       opt => opt.MapFrom(src => src.Showtime.Movie.Title))
            
            // Direct data from Showtime
            .ForMember(dest => dest.ShowDate, 
                       opt => opt.MapFrom(src => src.Showtime.ShowDate))
            .ForMember(dest => dest.StartTime, 
                       opt => opt.MapFrom(src => src.Showtime.StartTime))
            .ForMember(dest => dest.EndTime,
                       opt => opt.MapFrom(src => src.Showtime.EndTime))

            // Room and Theater
            .ForMember(dest => dest.RoomName, 
                       opt => opt.MapFrom(src => src.Showtime.Room.RoomName))
            .ForMember(dest => dest.CinemaName, 
                       opt => opt.MapFrom(src => src.Showtime.Room.Cinema.CinemaName))

            // Seats
            .ForMember(dest => dest.PurchasedSeats, 
                       opt => opt.MapFrom(src => src.TransactionSeats
                           .Select(ts => $"{ts.Seat.Row}-{ts.Seat.Number}").ToList()));
    }
}