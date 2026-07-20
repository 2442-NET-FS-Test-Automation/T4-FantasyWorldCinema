using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Cinema.Data.Entities;

[Table("Seats")]
public class Seats
{
    [Key]
    public int Seat_Id {get; set; }

    [Required]
    public int Room_Id {get; set; }
    public Rooms Room {get; set; } = default!;

    [Required]
    public char Row {get; set; }

    [Required]
    public int Number {get; set; }

    public ICollection<TransactionSeats> transactionSeats {get; set; } = default!;
}