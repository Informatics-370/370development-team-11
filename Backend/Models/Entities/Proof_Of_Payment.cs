using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProcionAPI.Models.Entities
{
    public class Proof_Of_Payment
    {
        [Key]
        public int Proof_Of_Payment_ID { get; set; }

        [Required]
        public int Procurement_Request_ID { get; set; }
        [ForeignKey("Procurement_Request_ID")]
        public Procurement_Details Procurement_Request { get; set; }
        public string Proof_Of_Payment_Doc { get; set; }
    }
}