using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProcionAPI.Models.Entities
{
    public class Vendor_Insurance
    {
        [Key]
        public int Insurance_ID { get; set; }

        public int Vendor_ID { get; set; }

        [ForeignKey("Vendor_ID")]
        public Vendor Vendor { get; set; }

        [Required]
        public int Vendor_Insurance_Type_ID { get; set; }


        [ForeignKey("Vendor_Insurance_Type_ID")]
        public Vendor_Insurance_Type Vendor_Insurance_Type { get; set; }

        public string Confirmation_Doc { get; set; }
    }
}