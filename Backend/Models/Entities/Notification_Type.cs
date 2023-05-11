using System.ComponentModel.DataAnnotations;

namespace ProcionAPI.Models.Entities
{
    public class Notification_Type
    {
        [Key]
        public int Notification_Type_ID { get; set; }

        [MaxLength(32)]
        public string Name { get; set; }

        [MaxLength(50)]
        public string Description { get; set; }
    }
}