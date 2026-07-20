using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Cinema.Data.Entities;

[Table("Users")]
public class Users
{
    [Key]
    public int User_Id {get; set; }

    [Required, MaxLength(50)]
    public string Username {get; set; } = default!;

    [Required, MaxLength(150), EmailAddress]
    public string Email {get; set; } = default!;

    [Required]
    public string PasswordHash {get; set; } = default!;

    [MaxLength(255)]
    public string FullName {get; set; } = default!;

    [Required]
    public int Role_Id {get; set; }
    public Roles Role {get; set; } = default!;

    public DateTime CreatedAt {get; set; }

    public ICollection<Transactions> transactions {get; set; } = default!;
}