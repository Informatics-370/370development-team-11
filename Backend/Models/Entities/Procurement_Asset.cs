using Microsoft.Data.SqlClient.DataClassification;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProcionAPI.Models.Entities
{
    public class Procurement_Asset
    {
        [Key]
        public int Procurement_Asset_ID { get; set; }
        [Key]
        [Required]
        public int Procurement_Request_ID { get; set; }
        [Key]
        [Required]
        public int Asset_ID { get; set; }
        [ForeignKey("Procurement_Request_ID")]
        public Procurement_Request Procurement_Request { get; set; }
        [ForeignKey("Asset_ID")]
        public Asset Asset { get; set; }
        public string Invoice_Document { get; set; }
    }
}
