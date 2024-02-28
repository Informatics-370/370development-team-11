using System.ComponentModel.DataAnnotations;

namespace ProcionAPI.Models.Entities
{
    public class Importance_Level
    {
        [Key]
        public int Importance_ID { get; set; }

        [MaxLength(32)]
        public string Name { get; set; }
    }
}