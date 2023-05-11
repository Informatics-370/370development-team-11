using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProcionAPI.Models.Entities
{
    public class Employee
    {
        [Key]
        public int EmployeeID { get; set; }
        [Required]
        public int User_Id { get; set; }
        [Required]
        public int Department_ID { get; set; }
        [Required]
        public int Branch_ID { get; set; }
        [Required]
        public int Mandate_ID { get; set; }
        [ForeignKey("User_Id")]
        public User? User { get; set; }
        [ForeignKey("Department_ID")]
        public Department? Department { get; set; }
        [ForeignKey("Branch_ID")]
        public Branch? Branch { get; set; }

        [ForeignKey("Mandate_ID")]
        public Mandate_Limit? Mandate_Limit { get; set; }

        [MaxLength(32)]
        public string EmployeeName { get; set; }

        [MaxLength(32)]
        public string EmployeeSurname { get; set; }

        [MaxLength(12)]
        public string CellPhone_Num { get; set; }

        [MaxLength(32)]
        public string Email { get; set; }
    }
}