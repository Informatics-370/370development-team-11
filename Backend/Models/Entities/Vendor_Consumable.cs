using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProcionAPI.Models.Entities
{
    public class Vendor_Consumable
    {
        [Key]
        public int Vendor_Consumbale_ID { get; set; }

        [Key]
        [Required]
        public int Consumable_ID { get; set; }

        [Key]
        [Required]
        public int Vendor_ID { get; set; }

        [ForeignKey("Consumable_ID")]
        public Consumable Consumable_IDs { get; set; }
        [ForeignKey("Vendor_ID")]
        public Vendor Vendor { get; set; }
    }
}
