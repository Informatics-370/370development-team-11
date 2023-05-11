using System.ComponentModel.DataAnnotations;

namespace ProcionAPI.Models.Entities
{
    public class Sign_Off_Status
    {
        [Key]
        public int Sign_Off_Status_ID { get; set; }

        [MaxLength(32)]
        public string Name { get; set; }

        [MaxLength(50)]
        public string Description { get; set; }
    }
}