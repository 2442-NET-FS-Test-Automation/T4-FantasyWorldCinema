namespace Cinema.Data.DTOs;

// Movies Performance
public record MovieRevenueDto(
    string MovieTitle,
    decimal TotalRevenue,
    int TicketsSold
);

public record CinemaRevenueDto(
    int CinemaId,
    string CinemaName,
    decimal TotalRevenue,
    int TotalTransactions
);

public record OccupancyRateDto(
    string MovieTitle,
    string CinemaName,
    DateOnly ShowDate,
    int TotalCapacity,
    int SoldSeats,
    double OccupancyPercentage
);

public record TransactionStatusSummaryDto(
    string Status,
    int Count,
    decimal TotalAmountInvolved
);

public record CinemasWithUsedDto(
    int CinemaId,
    string CinemaName
);