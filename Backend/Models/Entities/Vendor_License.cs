using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProcionAPI.Models.Entities
{
    public class Vendor_License
    {
        [Key]
        public int License_No { get; set; }
        public int Vendor_Detail_ID { get; set; }

        [ForeignKey("Vendor_Detail_ID")]
        public Vendor_Detail Vendor_Detail { get; set; }
        public string License_Doc_Upload { get; set; }
    }
}