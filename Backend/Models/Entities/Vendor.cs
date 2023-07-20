using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProcionAPI.Models.Entities
{
    public class Vendor
    {
        [Key]
        public int Vendor_ID { get; set; }
        [Required]
        public int Vendor_Status_ID { get; set; }


        [ForeignKey("Vendor_Status_ID")]
        public Vendor_Status Vendor_Status { get; set; }

        [MaxLength(32)]
        public string Name { get; set; }

        [MaxLength(32)]
        public string Email { get; set; }

        public int Number_Of_Times_Used { get; set; }
        public bool Sole_Supplier_Provided { get; set; }

        public bool PreferedVendor { get; set; }
    }
}