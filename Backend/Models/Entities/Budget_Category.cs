using System.ComponentModel.DataAnnotations;

namespace ProcionAPI.Models.Entities
{
    public class Budget_Category
    {
        [Key]
        public int Category_ID { get; set; }
        [Required]
        public string Account_Code { get; set; }

        [MaxLength(150)]
        public string Account_Name { get; set; }

        [MaxLength(200)]
        public string Description { get; set; }
    }
}