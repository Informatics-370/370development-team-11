using System.ComponentModel.DataAnnotations;

namespace ProcionAPI.Models.Entities
{
    public class Payment_Method
    {
        [Key]
        public int Payment_Method_ID { get; set; }

        [MaxLength(32)]
        public string Name { get; set; }

        [MaxLength(50)]
        public string Description { get; set; }
    }
}