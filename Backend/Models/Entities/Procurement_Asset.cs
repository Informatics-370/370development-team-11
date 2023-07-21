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
        public int Procurement_Details_ID { get; set; }
        [Key]
        [Required]
        public int Asset_ID { get; set; }
        [ForeignKey("Procurement_Details_ID")]
        public Procurement_Details Procurement_Details { get; set; }
        [ForeignKey("Asset_ID")]
        public Asset Asset { get; set; }
    }
}
