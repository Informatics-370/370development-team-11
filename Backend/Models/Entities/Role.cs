using System.ComponentModel.DataAnnotations;

namespace ProcionAPI.Models.Entities
{
    public class Role
    {
        [Key]
        public int Role_ID { get; set; }

        [MaxLength(32)]
        public string? Name { get; set; }

        [MaxLength(50)]
        public string? Description { get; set; }
        //public virtual ICollection<User>? Users { get; set; }
        //public ICollection<User_Access>? User_Accesses { get; set; }
    }
}