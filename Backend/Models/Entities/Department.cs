using System.ComponentModel.DataAnnotations;

namespace ProcionAPI.Models.Entities
{
    public class Department
    {
        [Key]
        public int Department_ID { get; set; }

        [MaxLength(32)]
        public string? Name { get; set; }

        [MaxLength(50)]
        public string? Description { get; set; }
    }
}