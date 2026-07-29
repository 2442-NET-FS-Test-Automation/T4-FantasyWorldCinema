namespace Cinema.ControllerApi.DTOs;

public record ShowtimeDto(int Showtime_Id, string Movie, string Poster, string Rating, 
    string Room, int Room_Id, DateOnly ShowDate, TimeOnly StartTime, TimeOnly EndTime, decimal Price);
public record ShowtimeCreateDto(int Movie_Id, int Room_Id, string Showdate, string StartTime, string EndTime, decimal Price);