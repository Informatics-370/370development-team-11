using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace ProcionAPI.Models.Entities
{
    public class UserSettings
    {
        [Key]
        public int Setting_ID { get; set; }
        public int TimerDuration { get; set; }
    }
}
