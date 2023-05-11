using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProcionAPI.Models.Entities
{
    public class HELP
    {
        [Key]
        public int Help_ID { get; set; }
        [Required]
        public int Help_Category_ID { get; set; }
        [ForeignKey("Help_Category_ID")]
        public Help_Category Help_Category { get; set; }
        [MaxLength(32)]
        public string Name { get; set; }
        public string Video { get; set; }
        [MaxLength(50)]
        public string Description { get; set; }
        public string User_Manual { get; set; }
    }
}
