namespace Cinema.ControllerApi.DTOs;

public record ShowtimeDto(int Showtime_Id, string Movie, string Room, int Room_Id, DateOnly ShowDate, TimeOnly StartTime, TimeOnly EndTime, decimal Price);