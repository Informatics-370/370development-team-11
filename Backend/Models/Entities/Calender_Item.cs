using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProcionAPI.Models.Entities
{
    public class Calender_Item
    {
        [Key]
        public int Calender_Item_ID { get; set; }

        [Required]
        public int Importance_ID { get; set; }

        [Required]
        public int Admin_ID { get; set; }

        [Required]
        public int EmployeeID { get; set; }



        [ForeignKey("Importance_ID")]
        public Importance_Level Importance_Level { get; set; }

        [ForeignKey("Admin_ID")]
        public Admin Admin { get; set; }

        [ForeignKey("EmployeeID")]
        public Employee Employee { get; set; }

        [MaxLength(32)]
        public string Name { get; set; }

        [MaxLength(50)]
        public string Description { get; set; }

        public DateTime Date { get; set; }
        public DateTime Time { get; set; }
    }
}