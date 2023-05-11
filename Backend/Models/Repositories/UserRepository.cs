using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using ProcionAPI.Data;
using ProcionAPI.Models.Entities;
using ProcionAPI.Controllers;

namespace ProcionAPI.Models.Repositories
{
    public class UserRepository : IUserRepository {
        private readonly AppDBContext _dbContext;

        public UserRepository(AppDBContext dbContext)
        {
            _dbContext = dbContext;
        }
    
        public async Task<Employee[]> GetAllEmployeesAsync()
        {
            IQueryable<Employee> query = _dbContext.Employee.Include(c => c.Branch)
                .Include(d => d.Department)
                .Include(m => m.Mandate_Limit)
                .Include(u => u.User)
                .ThenInclude(r => r.Role);


            return await query.ToArrayAsync();
        }

        public async Task<User[]> GetAllUsersAsync()
        {
            IQueryable<User> query = _dbContext.User.Include(c => c.Role);
                


            return await query.ToArrayAsync();
        }

        public async Task<User[]> AddUserAsync(User UserAdd, string name)
        {

            Role existingRole = await _dbContext.Role.FirstOrDefaultAsync(r => r.Name == name);
            //User existingUser = await _dbContext.User.FirstOrDefaultAsync(u => u.Username == UserAdd.Username);

            //if (existingUser != null)
            //{
            //    throw new Exception("User arleady exists");
            //}
            if (existingRole != null)
            {
                UserAdd.Role = existingRole;
            }
            

            await _dbContext.User.AddAsync(UserAdd);
            await _dbContext.SaveChangesAsync();

            return new User[] { UserAdd };
        }

        public async Task<Employee[]> AddEmployeeAsync(Employee EmployeeAdd, string usrName, string brName, string depName, int mlAmount)
        {

            User existingUser = await _dbContext.User.FirstOrDefaultAsync(u => u.Username == usrName);
            Branch existingBranch = await _dbContext.Branch.FirstOrDefaultAsync(b => b.Name == brName);
            Department existingDepartment = await _dbContext.Department.FirstOrDefaultAsync(d => d.Name == depName);
            Mandate_Limit existingMandateLimit = await _dbContext.Mandate_Limit.FirstOrDefaultAsync(m => m.Ammount == mlAmount);

            if (existingUser != null)
            {
                // Category already exists, assign its ID to the new consumable
                EmployeeAdd.User = existingUser;
            }

            if (existingBranch != null)
            {
                // Category already exists, assign its ID to the new consumable
                EmployeeAdd.Branch = existingBranch;
            }

            if (existingDepartment != null)
            {
                // Category already exists, assign its ID to the new consumable
                EmployeeAdd.Department = existingDepartment;
            }

            if (existingMandateLimit != null)
            {
                // Category already exists, assign its ID to the new consumable
                EmployeeAdd.Mandate_Limit = existingMandateLimit;
            }

            await _dbContext.Employee.AddAsync(EmployeeAdd);
            await _dbContext.SaveChangesAsync();

            return new Employee[] { EmployeeAdd };
        }

        public async Task<Employee> GetEmployeeAsync(int userID)
        {
            IQueryable<Employee> query = _dbContext.Employee.Include(c => c.Branch)
                .Include(d => d.Department)
                .Include(m => m.Mandate_Limit)
                .Include(u => u.User)
                .ThenInclude(r => r.Role)
                .Where(w => w.User.User_Id == userID);


            return await query.FirstOrDefaultAsync();
        }

        public void Delete<T>(T entity) where T : class
        {
            _dbContext.Remove(entity);
        }

        public async Task<User> GetUserAsync(int userID)
        {
            IQueryable<User> query = _dbContext.User.Include(c => c.Role)
                .Where(w => w.User_Id == userID);


            return await query.FirstOrDefaultAsync();
        }

        public async Task<Admin[]> GetAllAdminsAsync()
        {
            IQueryable<Admin> query = _dbContext.Admin
                .Include(u => u.User)
                .ThenInclude(r => r.Role);


            return await query.ToArrayAsync();
        }

        public async Task<Admin> GetAdminAsync(int userID)
        {
            IQueryable<Admin> query = _dbContext.Admin
                .Include(u => u.User)
                .ThenInclude(r => r.Role)
                .Where(w => w.User.User_Id == userID);


            return await query.FirstOrDefaultAsync();
        }

        public async Task<Admin[]> AddAdminAsync(Admin AdminAdd, string usrName)
        {

            User existingUser = await _dbContext.User.FirstOrDefaultAsync(u => u.Username == usrName);
            

            if (existingUser != null)
            {
                // Category already exists, assign its ID to the new consumable
                AdminAdd.User = existingUser;
            }

            await _dbContext.Admin.AddAsync(AdminAdd);
            await _dbContext.SaveChangesAsync();

            return new Admin[] { AdminAdd };
        }

        public async Task<bool> SaveChangesAsync()
        {
            return await _dbContext.SaveChangesAsync() > 0;
        }
    }

}