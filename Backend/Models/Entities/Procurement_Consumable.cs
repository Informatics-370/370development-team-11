using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProcionAPI.Models.Entities
{
    public class Procurement_Consumable
    {
        [Key]
        public int Procurement_Consumable_ID { get; set; }
        [Required]
        public int Procurement_Details_ID { get; set; }
        [Required]
        public int Consumable_ID { get;set; }
        [ForeignKey("Procurement_Details_ID")]
        public Procurement_Details Procurement_Details { get; set; }
        [ForeignKey("Consumable_ID")]
        public Consumable Consumable { get; set; }
        public int Quantity { get; set; }
    }
}
