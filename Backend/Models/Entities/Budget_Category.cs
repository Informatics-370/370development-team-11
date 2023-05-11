using System.ComponentModel.DataAnnotations;

namespace ProcionAPI.Models.Entities
{
    public class Budget_Category
    {
        [Key]
        public int Category_ID { get; set; }

        [MaxLength(32)]
        public string Account_Name { get; set; }

        [MaxLength(32)]
        public string Description { get; set; }
    }
}