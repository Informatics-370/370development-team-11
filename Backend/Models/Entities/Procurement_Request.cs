using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProcionAPI.Models.Entities
{
    public class Procurement_Request
    {
        [Key]
        public int Procurement_Request_ID { get; set; }
        [Required]
        public int Vendor_ID { get; set; }
        [ForeignKey("Vendor_ID")]
        public Vendor Vendor { get; set; }
        [Required]
        public int Requisition_Status_ID { get; set; }
        [ForeignKey("Requisition_Status_ID")]
        public Requisition_Status Requisition_Status { get; set; }
        [Required]
        public int User_ID { get; set; }
        [ForeignKey("User_ID")]
        public User User { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public string Description { get; set; }



    }
}
