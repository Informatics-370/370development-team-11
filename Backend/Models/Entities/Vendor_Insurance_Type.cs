using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProcionAPI.Models.Entities
{
    public class Vendor_Insurance_Type
    {
        [Key]
        public int Vendor_Insurance_Type_ID { get; set; }

        [MaxLength(32)]
        public string Name { get; set; }

        [MaxLength(50)]
        public string Description { get; set; }

    }
}
