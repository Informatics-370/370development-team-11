using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProcionAPI.Models.Entities
{
    public class Vendor_Tax
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int Income_Tax_Num { get; set; }

        public int Vendor_Detail_ID { get; set; }

        [ForeignKey("Vendor_Detail_ID")]
        public Vendor_Detail Vendor_Detail { get; set; }
        public string Tax_Clearance_Cert { get; set; }
    }
}