using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProcionAPI.Models.Entities
{
    public class Budget_Allocation
    {
        [Key]
        public int Budget_ID { get; set; }

        [Required]
        public int Department_ID { get; set; }

        [ForeignKey("Department_ID")]
        public Department Department { get; set; }
        public DateTime Date_Created { get; set; }
        public int Year { get; set; }
        public decimal Total { get; set; }
    }
}