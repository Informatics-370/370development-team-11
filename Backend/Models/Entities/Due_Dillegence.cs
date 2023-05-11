using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProcionAPI.Models.Entities
{
    public class Due_Dillegence
    {
        [Key]
        public int Due_Diligence_ID { get; set; }
        [Required]
        public int Vendor_Detail_ID { get; set; }
        [ForeignKey("Vendor_Detail_ID")]
        public Vendor_Detail Vendor_Detail { get; set; }
        public bool Due_Diligence_Doc { get; set; }
        public bool Mutual_Nda_Signed { get; set; }
        public bool Basic_Company_Info_Provided { get; set; }
        public bool Group_Structure_Provided { get; set; }
        public bool Income_Tax_Number_Provided { get; set; }
        public bool Tax_Clearance_Certificate_Provided { get; set; }
        public bool Vat_Number_Provided { get; set; }
        public bool Vat_Reg_Certificate_Provided { get; set; }
        public bool Company_Reg_Doc_Provided { get; set; }
        public bool Letter_Of_Good_Standing_Provided { get; set; }
        public bool B_BBEE_Certificate_Provided { get; set; }
        public bool Direcor_Details_Provided { get; set; }
        public bool Company_Resolution_Agreement_Provided { get; set; }
        public bool Subcontractor_Name_Provided { get; set; }
        public bool Company_Details_Provided { get; set; }
        public bool Individual_Details_Provided { get; set; }
        public bool General_Liability_Insurance_Present { get; set; }
        public bool Cyber_Insurance_Present { get; set; }
        public bool Proffesional_Indemnity_Insurance_Present { get; set; }
        public bool Other_Insurance_Required { get; set; }
        public bool Licenses_Required { get; set; }
        public bool Accreditation_Required { get; set; }
        public bool Proffesional_Membership_Required { get; set; }
        public bool Business_Continuity_Present { get; set; }
        public bool DIsaster_Recovery_Plan_Present { get; set; }
        public bool POPI_Present { get; set; }
        public bool Data_Security_Breaches_Present { get; set; }
        public bool Site_Visits_Present { get; set; }
        public bool Information_Security_Policy_Present { get; set; }
        public bool Privacy_Policy_Present_Present { get; set; }
        public bool Data_Retention_Destruction_Policy_Present { get; set; }
        public bool Anti_Bribery_Corruption_Policy_Present { get; set; }
        public bool Ethics_Policy_Present { get; set; }
        public bool Conflict_Of_Interest_Policy_Present { get; set; }
        public bool Customer_Complaints_Policy_Present { get; set; }
        public bool Business_References_Present { get; set; }
    }
}
