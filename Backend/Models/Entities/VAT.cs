using System.ComponentModel.DataAnnotations;

namespace ProcionAPI.Models.Entities
{
    public class VAT
    {
        [Key]
        public int VatID { get; set; }
        public decimal Percentage { get; set; }
        public DateTime Date { get; set; }
    }
}
