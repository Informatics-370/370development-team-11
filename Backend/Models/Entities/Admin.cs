using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProcionAPI.Models.Entities
{
    public class Admin
    {
        [Key]
        public int Admin_ID { get; set; }

        [Required]
        public int User_Id { get; set; }
        [ForeignKey("User_Id")]
        public User User { get; set; }

        [MaxLength(32)]
        public string AdminName { get; set; }

        [MaxLength(32)]
        public string AdminSurname { get; set; }

        [MaxLength(12)]
        public string CellPhone_Num { get; set; }

        [MaxLength(32)]
        public string Email { get; set; }
    }
}