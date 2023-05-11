using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProcionAPI.Models.Entities
{
    public class POPI
    {
        [Key]
        public int POPI_ID { get; set; }
        [Required]
        public int Contracted_Partner_Type_ID { get; set; }
        [Required]
        public int Due_Diligence_ID { get; set; }

        [ForeignKey("Contracted_Partner_Type_ID")]
        public Contracted_Partner_Type Contracted_Partner_Type { get; set; }
        [ForeignKey("Due_Diligence_ID")]
        public Due_Dillegence Due_Dillegence { get; set; }
        public bool Personal_Data_Purpose { get; set; }
        public bool DataProcessing_JointController_Agreement { get; set; }
        public bool Confidentiality_Importance_Highlighted { get; set; }
        public bool Contract_Audits_Provisions_Provided { get; set; }
        public bool Activity_Liability_Present { get; set; }
        public bool Third_Party_Data_Processing_Provisioned { get; set; }
        public bool Contract_End_Data_Management_Provided { get; set; }
        public bool Personal_Data_Processing_Details_Present { get; set; }
        public bool Processing_Activities_Certification_Held { get; set; }
    }
}
