using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Cinema.Data.Entities;

[Table("Showtimes")]
public class Showtimes
{
    [Key]
    public int Showtime_Id {get; set; }

    [Required]
    public int Movie_Id {get; set; }
    public Movies Movie {get; set; } = default!;

    [Required]
    public int Room_Id {get; set; }
    public Rooms Room {get; set; } = default!;

    [Required]
    public DateOnly ShowDate {get; set; }

    [Required]
    public TimeOnly StartTime {get; set; }

    [Required]
    public TimeOnly EndTime {get; set; }

    [Required, Range(.1, float.MaxValue), Precision(10,2)]
    public decimal Price {get; set; }

    public ICollection<Transactions> transactions {get; set; } = default!;

    
}