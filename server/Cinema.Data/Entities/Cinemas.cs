using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Cinema.Data.Entities;

[Table("Cinemas")]
public class Cinemas
{
    [Key]
    public int Cinema_Id {get; set; }

    [Required, MaxLength(100)]
    public string CinemaName {get; set; } = default!;
    [MaxLength(1000)]
    public string Address {get; set; } = default!;

    public City City {get; set; }

    public ICollection<Rooms> rooms {get; set; } = default!;
}