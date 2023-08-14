using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProcionAPI.Models.Entities
{
    public class Access
    {
        [Key]
        public int Access_ID { get; set; }

        [Required]
        public string IsAdmin { get; set; }
        [Required]
        public string CanAccInv { get; set; }
        [Required]
        public string CanAccFin { get; set; }
        [Required]
        public string CanAccPro { get; set; }
        [Required]
        public string CanAccVen { get; set; }
        [Required]
        public string CanAccRep { get; set; }
        [Required]
        public string CanViewPenPro { get; set; }
        [Required]
        public string CanViewFlagPro { get; set; }
        [Required]
        public string CanViewFinPro { get; set; }
        [Required]
        public string CanAppVen { get; set; }
        [Required]
        public string CanEditVen { get; set; }
        [Required]
        public string CanDeleteVen { get; set; }


    }
}