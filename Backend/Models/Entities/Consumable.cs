using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProcionAPI.Models.Entities
{
    public class Consumable
    {
        [Key]
        public int Consumable_ID { get; set; }

        [Required]
        public int Consumable_Category_ID { get; set; }

        [ForeignKey("Consumable_Category_ID")]
        public Consumable_Category Consumable_Category { get; set; }

        [MaxLength(32)]
        public string Name { get; set; }

        [MaxLength(50)]
        public string Description { get; set; }

        public int On_Hand { get; set; }

        public int Minimum_Reorder_Quantity { get; set; }

        public int Maximum_Reorder_Quantity { get; set; }
    }

}
