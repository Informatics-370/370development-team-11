using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProcionAPI.Models.Entities
{
    public class Onboard_Request
    {
        [Key]
        public int Onboard_Request_Id { get; set; }
        [Key]
        [Required]
        public int User_Id { get; set; }

        [Key]
        [Required]
        public int Vendor_ID { get; set; }

        [ForeignKey("User_Id")]
        public User Users { get; set; }

        [ForeignKey("Vendor_ID")]
        public Vendor Vendor { get; set; }
        public string Quotes { get; set; }
    }
}