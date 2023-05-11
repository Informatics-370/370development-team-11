using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProcionAPI.Models.Entities
{
    public class Vendor_Asset
    {
        [Key]
        public int Vendor_Asset_ID { get; set; }

        [Required]
        public int Vendor_ID { get; set; }
        [Required]
        public int Vendor_Detail_ID { get; set; }
        [ForeignKey("Vendor_ID")]
        public Vendor Vendor { get; set; }
        [ForeignKey("Vendor_Detail_ID")]
        public Vendor_Detail Vendor_Detail { get; set; }
        public string Quotes { get; set; }
    }
}
