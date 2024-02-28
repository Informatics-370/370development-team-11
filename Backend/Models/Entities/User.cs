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
        [Required]
        public int Access_ID { get; set; }
        [ForeignKey("Role_ID")]
        public Role Role { get; set; }

        [ForeignKey("Access_ID")]
        public Access Access { get; set; }

        [MaxLength(32)]
        public string? Username { get; set; }

        [MaxLength(100)]
        public string? Password { get; set; }

        public string? Profile_Picture { get; set; }
        public int? No_Notifications { get; set; }
        public int? No_VenNotifications { get; set; }
        public int? No_InvNotifications { get; set; }
        public int? No_DelNotifications { get; set; }
        public int? No_ProNotifications { get; set; }
    }
}