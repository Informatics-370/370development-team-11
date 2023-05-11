using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProcionAPI.Models.Entities
{
    public class Vendor_Website
    {
        [Key]
        public int Website_ID { get; set; }

        public int Vendor_Detail_ID { get; set; }

        [ForeignKey("Vendor_Detail_ID")]
        public Vendor_Detail Vendor_Detail { get; set; }
        public string URL { get; set; }
    }
}