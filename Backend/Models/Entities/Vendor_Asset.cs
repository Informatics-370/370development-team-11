using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProcionAPI.Models.Entities
{
    public class Vendor_Asset
    {
        [Key]
        public int Vendor_Asset_ID { get; set; }

        [Required]
        public int Asset_ID { get; set; }
        [Required]
        public int Vendor_ID { get; set; }
        [ForeignKey("Asset_ID")]
        public Asset Asset { get; set; }
        [ForeignKey("Vendor_ID")]
        public Vendor Vendor { get; set; }
    }
}
