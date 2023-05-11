using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProcionAPI.Models.Entities
{
    public class Vendor_Registration
    {
        [Key]
        public int Company_Registration_Number { get; set; }

        public int Vendor_Detail_ID { get; set; }

        [ForeignKey("Vendor_Detail_ID")]
        public Vendor_Detail Vendor_Detail { get; set; }
        public string Proof_Of_Registration_Doc { get; set; }
    }
}