using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProcionAPI.Models.Entities
{
    public class Access
    {
        [Key]
        public int Access_ID { get; set; }

        [Required]
        public int Temp_Access_ID { get; set; }

        [ForeignKey("Temp_Access_ID")]
        public Temporary_Access Temporary_Access { get; set; }

        [MaxLength(32)]
        public string Name { get; set; }

        [MaxLength(50)]
        public string Description { get; set; }
    }
}