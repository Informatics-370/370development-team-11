using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProcionAPI.Models.Entities
{
    public class Access
    {
        [Key]
        public int Access_ID { get; set; }
        public string IsAdmin { get; set; }
        public string CanAccInv { get; set; }
        public string CanAccFin { get; set; }
        public string CanAccPro { get; set; }
        public string CanAccVen { get; set; }
        public string CanAccRep { get; set; }
        public string CanViewPenPro { get; set; }
        public string CanViewFlagPro { get; set; }
        public string CanViewFinPro { get; set; }
        public string CanAppVen { get; set; }
        public string CanEditVen { get; set; }
        public string CanDeleteVen { get; set; }


    }
}