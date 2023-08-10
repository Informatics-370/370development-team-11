using System.ComponentModel.DataAnnotations;

namespace ProcionAPI.Models.Entities
{
    public class AuditLog
    {
        [Key]
        public int Log_ID { get; set; }
        public String User { get; set; }
        public String Action { get; set; }
        public DateTime ActionTime { get; set; }
    }
}
