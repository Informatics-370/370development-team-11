using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProcionAPI.Models.Entities
{
    public class Budget_Line
    {
        [Key]
        [Required]
        public int Account_Code { get; set; }

        [Key]
        [Required]
        public int Budget_ID { get; set; }

        [Key]
        [Required]
        public int Category_ID { get; set; }

        [ForeignKey("Budget_ID")]
        public Budget_Allocation Budget_Allocation { get; set; }

        [ForeignKey("Category_ID")]
        public Budget_Category Budget_Category { get; set; }
        public DateTime Month { get; set; }
        public decimal BudgetAmt { get; set; }
        public decimal ActualAmt { get; set; }
        public decimal Variance { get; set; }
    }
}