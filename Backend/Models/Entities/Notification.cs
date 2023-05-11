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
        public int Calender_Item_ID { get; set; }
        [Required]
        public int Notification_Type_ID { get; set; }

        [ForeignKey("Calender_Item_ID")]
        public Calender_Item Calender_Item { get; set; }
        [ForeignKey("Notification_Type_ID")]
        public Notification_Type Notification_Type { get; set; }

        [MaxLength(32)]
        public string Name { get; set; }

        [MaxLength(50)]
        public string Description { get; set; }

        public DateTime Due_Date { get; set; }
    }
}