using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace ProcionAPI.Models.Entities
{
    public class Procurement_Request_Quote
    {
        [Key]
        public int Quote_ID { get; set; }
        [Required]
        public int Procurement_Request_ID { get; set; }
        [ForeignKey("Procurement_Request_ID")]
        public Procurement_Request Procurement_Request { get; set; }
        [Required]
        public string Path { get; set; }
    }
}
