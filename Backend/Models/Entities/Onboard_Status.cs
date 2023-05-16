using System.ComponentModel.DataAnnotations;

namespace ProcionAPI.Models.Entities
{
    public class Onboard_Status
    {
        [Key]
        public int Status_ID { get; set; }
        [MaxLength(32)]
        public string Name { get; set; }

        [MaxLength(50)]
        public string Description { get; set; }
    }
}
