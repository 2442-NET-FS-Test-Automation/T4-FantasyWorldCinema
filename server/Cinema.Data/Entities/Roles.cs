using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Cinema.Data.Entities;

[Table("Roles")]
public class Roles
{
    [Key]
    public int Role_Id {get; set; }


    [Required, MaxLength(50)]
    public string RoleName {get; set; } = default!;
    public ICollection<Users> users {get; set; } = default!;
    
}