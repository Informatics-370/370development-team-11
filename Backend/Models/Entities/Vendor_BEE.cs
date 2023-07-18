using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProcionAPI.Models.Entities
{
    public class Vendor_BEE
    {
        [Key]
        public int BEE_ID { get; set; }

        [Required]
        public int Vendor_ID { get; set; }

        [ForeignKey("Vendor_ID")]
        public Vendor Vendor { get; set; }
        public int BEE_Level { get; set; }
        public string BEE_Certificate { get; set; }
        public DateTime Date { get; set; }
    }
}