using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Reflection;

namespace ProcionAPI.Models.Entities
{
    public class Notification
    {
        [Key]
        public int Notification_ID { get; set; }

        [Required]
        public int Notification_Type_ID { get; set; }

        [ForeignKey("Notification_Type_ID")]
        public Notification_Type Notification_Type { get; set; }

        [Required]
        public int User_Id { get; set; }

        [ForeignKey("User_Id")]
        public User User { get; set; }

        [MaxLength(100)]
        public string Name { get; set; }

        public DateTime Send_Date { get; set; }
    }
}