using System.ComponentModel.DataAnnotations;
#pragma warning disable CS8618

public class CreateTransactionDto
{
    [Required(ErrorMessage = "The Showtime ID is required")]
    public int ShowtimeId {get; set;}
    [Required]
    [MinLength(1, ErrorMessage = "You must select at least one seat")]
    public List<int> SeatIds {get; set;}
}

public class TransactionResponseDto
{
    // Transaction information
    public int TransactionId { get; set; }
    public DateTime PurchaseDate { get; set; }
    public decimal TotalAmount { get; set; } 
    public string Status { get; set; } 

    // Showtime data
    public string MovieTitle { get; set; }
    public DateOnly ShowDate { get; set; }
    public TimeOnly StartTime { get; set; }
    public TimeOnly EndTime { get; set; }
    public string CinemaName { get; set; }
    public string RoomName { get; set; }

    // seats details (e.g. ["A-1", "A-2"])
    public List<string> PurchasedSeats { get; set; }
}