using System.ComponentModel.DataAnnotations;

namespace ProcionAPI.Models.Entities
{
    public class Contracted_Partner_Type
    {
        [Key]
        public int Contracted_Partner_Type_ID { get; set; }
        [MaxLength(32)]
        public string Name { get; set; }

        [MaxLength(50)]
        public string Description { get; set; }
    }
}
