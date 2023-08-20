using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProcionAPI.Models.Entities
{
    public class Procurement_Invoice
    {
        [Key]
        public int Invoice_ID { get; set; }
        public string Path { get; set; }
        public DateTime Date_Uploaded { get; set; }
        public int Procurement_Details_ID { get; set; }
        [ForeignKey("Procurement_Details_ID")]
        public Procurement_Details Procurement_Details { get; set; }
    }
}
