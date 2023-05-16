using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProcionAPI.Models.Entities
{
    public class Sole_Supplier
    {
        [Key]
        public int Sole_Supplier_ID { get; set; }
        [Required]
        public int Vendor_ID { get; set; }
        [ForeignKey("Vendor_ID")]
        public Vendor Vendor { get; set; }
        public bool MD_Approval { get; set; }
        public DateTime Date { get; set; }
        public string Reason { get; set; }
    }
}