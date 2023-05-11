using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProcionAPI.Models.Entities
{
    public class Delegation_Of_Authority
    {
        [Key]
        public int Delegation_ID { get; set; }

        [Required]
        public int User_Id { get; set; }

        [Required]
        public int Admin_ID { get; set; }

        [ForeignKey("User_Id")]
        public User User { get; set; }

        [ForeignKey("Admin_ID")]
        public Admin Admin { get; set; }

        public DateTime From_Date { get; set; }
        public DateTime To_Date { get; set; }
        public string Delegation_Document { get; set; }
        public ICollection<Temporary_Access> Temporary_Access { get; set; }
    }
}