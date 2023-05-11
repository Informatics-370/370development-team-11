using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProcionAPI.Models.Entities
{
    public class User_Access
    {
        [Key]
        [Required]
        public int Role_ID { get; set; }

        [Key]
        [Required]
        public int Access_ID { get; set;}

        [ForeignKey("Role_ID")]
        public Role Role { get; set; }

        [ForeignKey("Access_ID")]
        public Access Access { get; set; }

    }
}
