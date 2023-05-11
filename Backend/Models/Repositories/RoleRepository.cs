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
    }
}