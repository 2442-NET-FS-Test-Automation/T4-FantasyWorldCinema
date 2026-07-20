using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Cinema.Data.Entities;

[Table("Movies")]
public class Movies
{
    [Key]
    public int Movie_Id {get; set; }

    [Required]
    public string Title {get; set; } = default!;

    [Required]
    public Genre Genre {get; set; }

    [Required]
    public int DurationMinutes {get; set; }

    public Rating Rating {get; set; }

    [MaxLength(1000)]
    public string Synopsis {get; set; } = default!;

    [MaxLength(1000)]
    public string PosterUrl {get; set; } = default!;


    public ICollection<Showtimes> showtimes {get; set; } = default!;
}