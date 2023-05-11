using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProcionAPI.Models.Entities
{
    public class Vendor_Detail
    {
        [Key]
        public int Vendor_Detail_ID { get; set; }

        [Required]
        public int Vendor_Category_ID { get; set; }

        [Required]
        public int Vendor_ID { get; set; }

        [ForeignKey("Vendor_Category_ID")]
        public Vendor_Category Vendor_Category { get; set; }
        [ForeignKey("Vendor_ID")]
        public Vendor Vendor { get; set; }

        [MaxLength(10)]
        public char Telephone_Num { get; set; }

        [MaxLength(3)]
        public string Contact_Person_Title { get; set; }

        [MaxLength(3)]
        public string Contact_Person_Name { get; set; }

        [MaxLength(10)]
        public char Contact_Person_ContactNum { get; set; }

        [MaxLength(32)]
        public string Contact_Person_Email { get; set; }

        [MaxLength(100)]
        public string Registered_Address { get; set; }

        public bool FaxProvided { get; set; }
        public bool WebsiteProvided { get; set; }

        [MaxLength(50)]
        public string Description_GSP { get; set; }

        public bool VatRegistered { get; set; }
        public bool Registration_Provided { get; set; }
        public bool Income_Tax_Num_Provided { get; set; }
        public bool SoleSupplierProvided { get; set; }
        public bool POPIA_Provided { get; set; }
        public bool Payment_Terms_Provided { get; set; }
        public bool Insurance_Provided { get; set; }
        public bool Signed_Agreement_Provided { get; set; }
        public bool License_Num_Provided { get; set; }

        [MaxLength(32)]
        public string Bank_Name { get; set; }

        [MaxLength(32)]
        public string Account_Holder { get; set; }

        [MaxLength(10)]
        public char Bank_Account_Number { get; set; }

        public char Branch_Code { get; set; }

        [MaxLength(32)]
        public string Account_Type { get; set; }

        public string Bank_Contact_Name { get; set; }

        [MaxLength(10)]
        public char Bank_Contact_PhoneNum { get; set; }

        public string BankStampedConfirtmation { get; set; }
        public bool BeeRegistered { get; set; }
        public bool DueDIllegenceRequired { get; set; }
        public DateTime DateAccepted { get; set; }
    }
}