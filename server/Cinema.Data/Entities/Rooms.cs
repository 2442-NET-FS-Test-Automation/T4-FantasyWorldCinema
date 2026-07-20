using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Cinema.Data.Entities;

[Table("Rooms")]
public class Rooms
{
    [Key]
    public int Room_Id {get; set; }

    [Required]
    public int Cinema_Id {get; set; }
    public Cinemas Cinema {get; set; } = default!;

    [Required, MaxLength(100)]
    public string RoomName {get; set; } = default!;

    [Required]
    public int Capacity {get; set; }

    public ICollection<Seats> seats {get; set; } = default!;
    public ICollection<Showtimes> showtimes {get; set; } = default!;
}