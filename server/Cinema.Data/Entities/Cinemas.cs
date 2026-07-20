using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Cinema.Data.Entities;

[Table("Cinemas")]
public class Cinemas
{
    [Key]
    public int Cinema_Id {get; set; }

    [Required]
    public string CinemaName {get; set; } = default!;

    public string Address {get; set; } = default!;

    public int City {get; set; }

    public ICollection<Rooms> rooms {get; set; } = default!;
}