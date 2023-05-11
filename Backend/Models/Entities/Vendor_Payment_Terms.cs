using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProcionAPI.Models.Entities
{
    public class Vendor_Payment_Terms
    {
        [Key]
        public int Payment_Terms_ID { get; set; }

        public int Vendor_Detail_ID { get; set; }

        [ForeignKey("Vendor_Detail_ID")]
        public Vendor_Detail Vendor_Detail { get; set; }

        [MaxLength(50)]
        public string Payment_Terms { get; set; }
    }
}