using ProcionAPI.Models.Entities;

namespace ProcionAPI.Models.Repositories
{
    public interface IRoleRepository
    {
        Task<Role[]> GetAllRoleAsync();
        Task<Role[]> AddRoleAsync(Role RoleAdd);
        Task<bool> SaveChangesAsync();
        Task<Role> GetRoleAsync(int roleID);
        void Delete<T>(T entity) where T : class;
        Task<Role> CreateRoleValidationAsync(string name);
        Task<Role> EditRoleValidationAsync(string name, int id);
        Task<Role> UpdateRoleAsync(int id, Role role);
    }
}