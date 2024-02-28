using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProcionAPI.Models.Entities
{
    public class Vendor_Fax
    {
        [Key]
        public int Fax_ID { get; set; }

        public int Vendor_Detail_ID { get; set; }

        [ForeignKey("Vendor_Detail_ID")]
        public Vendor_Detail Vendor_Detail { get; set; }

        [MaxLength(32)]
        public string Fax { get; set; }
    }
}