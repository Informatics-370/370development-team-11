using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using ProcionAPI.Data;
using ProcionAPI.Models.Entities;
using ProcionAPI.Controllers;

namespace ProcionAPI.Models.Repositories
{
    public class RoleRepository: IRoleRepository
    {
        private readonly AppDBContext _dbContext;

        public RoleRepository(AppDBContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<Role[]> GetAllRoleAsync()
        {
            IQueryable<Role> query = _dbContext.Role;
            return await query.ToArrayAsync();
        }

        public async Task<Role[]> AddRoleAsync(Role RoleAdd)
        {
            await _dbContext.Role.AddAsync(RoleAdd);
            await _dbContext.SaveChangesAsync();

            return new Role[] { RoleAdd };
        }

        public async Task<Role> GetRoleAsync(int roleID)
        {
            IQueryable<Role> query = _dbContext.Role.Where(c => c.Role_ID == roleID);
            return await query.FirstOrDefaultAsync();
        }

        public void Delete<T>(T entity) where T : class
        {
            _dbContext.Remove(entity);
        }
        
        public async Task<bool> SaveChangesAsync()
        {
            return await _dbContext.SaveChangesAsync() > 0;
        }

        public async Task<Role> RoleValidationAsync(string name)
        {
            Role ExistingRole = await _dbContext.Role.FirstOrDefaultAsync(x => x.Name == name);
            if (ExistingRole != null)
            {
                return ExistingRole;
            }

            else
            {
                return null;
            }
        }

        public async Task<Role> UpdateRoleAsync(int id, Role role)
        {
            var rl = await _dbContext.Role.FindAsync(id);

            rl.Name = role.Name;
            rl.Description = role.Description;

            //Role existingRole = await _dbContext.Role.FirstOrDefaultAsync(c => c.Name == role.Name);

            

            await _dbContext.SaveChangesAsync();

            return rl;
        }
    }
}