using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProcionAPI.Models.Entities
{
    public class Access
    {
        [Key]
        public int Access_ID { get; set; }

        [Required]
        public bool IsAdmin { get; set; }
        [Required]
        public bool CanAccInv { get; set; }
        [Required]
        public bool CanAccFin { get; set; }
        [Required]
        public bool CanAccPro { get; set; }
        [Required]
        public bool CanAccVen { get; set; }
        [Required]
        public bool CanAccRep { get; set; }
        [Required]
        public bool CanViewPenPro { get; set; }
        [Required]
        public bool CanViewFlagPro { get; set; }
        [Required]
        public bool CanViewFinPro { get; set; }
        [Required]
        public bool CanAppVen { get; set; }
        [Required]
        public bool CanEditVen { get; set; }
        [Required]
        public bool CanDeleteVen { get; set; }


    }
}