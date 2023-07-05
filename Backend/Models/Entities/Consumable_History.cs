using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace ProcionAPI.Models.Entities
{
    public class Consumable_History
    {
        [Key]
        public int History_ID { get; set; }

        [Required]
        public int Consumable_ID { get; set; }

        [ForeignKey("Consumable_ID")]
        public Consumable Consumable { get; set; }

        public DateTime DateCaptured { get; set; }
    }
}
