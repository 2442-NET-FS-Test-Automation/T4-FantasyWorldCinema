using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Cinema.Data.Entities;

[Table("TransactionSeats")]
public class TransactionSeats
{
    [Key]
    public int TransactionSeat_Id {get; set; }

    [Required]
    public int Transaction_Id {get; set; }
    public Transactions Transaction {get; set; } = default!;

    [Required]
    public int Seat_Id {get; set; }
    public Seats Seat {get; set; } = default!;
}