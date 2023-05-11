using System.ComponentModel.DataAnnotations;

namespace ProcionAPI.Models.Entities
{
    public class Mandate_Limit
    {
        [Key]
        public int Mandate_ID { get; set; }

        public double Ammount { get; set; }
        public DateTime Date { get; set; }
    }
}