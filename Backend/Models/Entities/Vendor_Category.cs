using System.ComponentModel.DataAnnotations;

namespace ProcionAPI.Models.Entities
{
    public class Vendor_Category
    {
        [Key]
        public int Vendor_Category_ID { get; set; }

        [MaxLength(32)]
        public string Name { get; set; }

        [MaxLength(50)]
        public string Description { get; set; }
    }
}