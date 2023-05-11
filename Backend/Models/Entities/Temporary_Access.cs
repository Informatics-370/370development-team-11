using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProcionAPI.Models.Entities
{
    public class Temporary_Access
    {
        [Key]
        public int Temp_Access_ID { get; set; }

        [Required]
        public int Delegation_ID { get; set; }

        [ForeignKey("Delegation_ID")]
        public Delegation_Of_Authority Delegation_Of_Authority { get; set; }

        [MaxLength(32)]
        public string Name { get; set; }

        [MaxLength(50)]
        public string Description { get; set; }
    }
}