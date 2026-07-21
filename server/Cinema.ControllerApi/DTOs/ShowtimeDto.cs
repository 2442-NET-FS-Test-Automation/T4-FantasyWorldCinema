namespace Cinema.ControllerApi.DTOs;

public record ShowtimeDto(int Showtime_Id, string Movie, string Room, DateOnly ShowDate, TimeOnly StartTime, TimeOnly EndTime, decimal Price);