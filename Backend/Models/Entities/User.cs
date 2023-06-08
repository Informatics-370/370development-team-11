using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProcionAPI.Models.Entities
{
    public class User
    {
        [Key]
        public int User_Id { get; set; }
        [Required]
        public int Role_ID { get; set; }

        [ForeignKey("Role_ID")]
        public Role Role { get; set; }

        [MaxLength(32)]
        public string? Username { get; set; }

        [MaxLength(100)]
        public string? Password { get; set; }

        public string? Profile_Picture { get; set; }
        //public ICollection<Delegation_Of_Authority>? Delegation_Of_Authority { get; set; }

        //public virtual ICollection<Employee> Employees { get; set; }
    }
}