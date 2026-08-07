using Microsoft.AspNetCore.Mvc;

namespace Cinema.ControllerApi.DTOs;

public record RequestTopMoviesByRevenueDto(
    [FromQuery(Name = "startDate")] DateTime StartDate, 
    [FromQuery(Name = "endDate")] DateTime EndDate, 
    int Limit
);

public record RequestGenericReportDto(
    [FromQuery(Name = "startDate")] DateTime StartDate, 
    [FromQuery(Name = "endDate")] DateTime EndDate
);

public record RequestOccupancyRatesDto(
    [FromQuery(Name = "startDate")] DateTime StartDate, 
    [FromQuery(Name = "endDate")] DateTime EndDate, 
    [FromQuery(Name = "cinemaId")] int? CinemaId
);