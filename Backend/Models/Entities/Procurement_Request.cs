using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProcionAPI.Models.Entities
{
    public class Procurement_Request
    {
        [Key]
        public int Procurement_Request_ID { get; set; }
        [Required]
        public int Requisition_Status_ID{ get; set; }
        [Required]
        public int EmployeeID { get; set; }
        [Required]
        public int Vendor_ID { get; set; }
        [Required]
        public int Sign_Off_Status_ID { get; set; }
        [Required]
        public int Procurement_Payment_Status_ID { get; set; }
        [Required]
        public int Account_Code { get; set; }
        [Required]
        public int Procurement_Status_ID { get; set; }
        [Required]
        public int Payment_Method_ID { get; set; }
        [ForeignKey("Requisition_Status_ID")]
        public Requisition_Status Requisition_Status { get; set; }
        [ForeignKey("EmployeeID")]
        public Employee Employee { get; set; }
        [ForeignKey("Vendor_ID")]
        public Vendor Vendor { get; set; }
        [ForeignKey("Sign_Off_Status_ID")]
        public Sign_Off_Status Sign_Off_Status { get; set; }
        [ForeignKey("Procurement_Payment_Status_ID")]
        public Procurement_Payment_Status Procurement_Payment_Status { get; set; }
        [ForeignKey("Account_Code, Budget_ID, Category_ID")]
        public Budget_Line Budget_Line { get; set; }
        [ForeignKey("Procurement_Status_ID")]
        public Procurement_Status Procurement_Status { get; set; }
        [ForeignKey("Payment_Method_ID")]
        public Payment_Method Payment_Method { get; set; }

        [MaxLength(32)]
        public string Item_Type { get; set; }

        [MaxLength(32)]
        public string Buyer_Name { get; set; }

        [MaxLength(32)]
        public string Buyer_Email { get; set; }

        public bool Deposit_Required { get; set; }
        public DateTime Full_Payment_Due_Date { get; set; }
        public decimal Total_Amount { get; set; }
        public bool Payment_Made { get; set; }

        [MaxLength(50)]
        public string Comment { get; set; }

        public bool Proof_Of_Payment_Required { get; set; }
    }
}