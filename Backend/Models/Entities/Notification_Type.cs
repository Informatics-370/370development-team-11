using System.ComponentModel.DataAnnotations;

namespace ProcionAPI.Models.Entities
{
    public class Notification_Type
    {
        [Key]
        public int Notification_Type_ID { get; set; }

        [MaxLength(100)]
        public string Name { get; set; }

        [MaxLength(100)]
        public string Description { get; set; }
    }
}