using System.ComponentModel.DataAnnotations;

namespace ProcionAPI.Models.Entities
{
    public class Consumable_Category
    {
        [Key]
        public int Consumable_Category_ID { get; set; }
        [MaxLength(32)]
        public string Name { get; set; }

        [MaxLength(50)]
        public string Description { get; set; }

    }
}
