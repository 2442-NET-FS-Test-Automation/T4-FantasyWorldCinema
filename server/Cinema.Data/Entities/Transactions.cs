using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Cinema.Data.Entities;

[Table("Transactions")]
public class Transactions
{
    [Key]
    public int Transaction_Id {get; set; }

    [Required]
    public int User_Id {get; set; }
    public Users User {get; set; } = default!;

    [Required]
    public int Showtime_Id {get; set; }
    public Showtimes Showtime {get; set; } = default!;

    public DateTime PurchaseDate {get; set; }

    [Required, Range(.1, float.MaxValue), Precision(10,2)]
    public decimal TotalAmount {get; set; }

    [Required]
    public Status Status {get; set; }

    public ICollection<TransactionSeats> transactionSeats {get; set; } = default!;
    public byte[] RowVersion {get; set; } = default!;
}