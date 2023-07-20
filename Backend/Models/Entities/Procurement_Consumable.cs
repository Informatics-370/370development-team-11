using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProcionAPI.Models.Entities
{
    public class Procurement_Consumable
    {
        [Key]
        public int Procurement_Consumable_ID { get; set; }
        [Required]
        public int Procurement_Request_ID { get; set; }
        [Required]
        public int Consumable_ID { get;set; }
        [ForeignKey("Procurement_Request_ID")]
        public Procurement_Request Procurement_Request { get; set; }
        [ForeignKey("Consumable_ID")]
        public Consumable Consumable { get; set; }
        public int Quantity { get; set; }
        public string Invoice_Document { get; set; }
    }
}
