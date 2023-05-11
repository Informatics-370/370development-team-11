using System.ComponentModel.DataAnnotations;

namespace ProcionAPI.Models.Entities
{
    public class Branch
    {
        [Key]
        public int Branch_ID { get; set; }

        [MaxLength(32)]
        public string Name { get; set; }

        [MaxLength(100)]
        public string Street { get; set; }

        [MaxLength(30)]
        public string City { get; set; }

        [MaxLength(4)]
        public string Postal_Code { get; set; }

        [MaxLength(20)]
        public string Province { get; set; }
    }
}