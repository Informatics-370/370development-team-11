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

        public async Task<User[]> AddUserAsync(User UserAdd)
        {

            Role existingRole = await _dbContext.Role.FirstOrDefaultAsync(u => u.Name == UserAdd.Role.Name);

            if (existingRole != null)
            {
                // Category already exists, assign its ID to the new consumable
                UserAdd.Role = existingRole;
            }

            await _dbContext.User.AddAsync(UserAdd);
            await _dbContext.SaveChangesAsync();

            return new User[] { UserAdd };
        }

        public async Task<Employee[]> AddEmployeeAsync(Employee EmployeeAdd)
        {

            User existingUser = await _dbContext.User.FirstOrDefaultAsync(u => u.Username == EmployeeAdd.User.Username);
            Branch existingBranch = await _dbContext.Branch.FirstOrDefaultAsync(b => b.Name == EmployeeAdd.Branch.Name);
            Department existingDepartment = await _dbContext.Department.FirstOrDefaultAsync(d => d.Name == EmployeeAdd.Department.Name);
            Mandate_Limit existingMandate = await _dbContext.Mandate_Limit.FirstOrDefaultAsync(m => m.Ammount == EmployeeAdd.Mandate_Limit.Ammount);


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
            if (existingMandate != null)
            {
                // Category already exists, assign its ID to the new consumable
                EmployeeAdd.Mandate_Limit = existingMandate;
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

        public async Task<Admin[]> AddAdminAsync(Admin AdminAdd)
        {

            User existingUser = await _dbContext.User.FirstOrDefaultAsync(u => u.Username == AdminAdd.User.Username);
            

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

        public async Task<User> UserValidationAsync(string name)
        {
            User ExistingUser = await _dbContext.User.FirstOrDefaultAsync(x => x.Username == name);
            if (ExistingUser != null)
            {
                return ExistingUser;
            }

            else
            {
                return null;
            }
        }

        public async Task<User> UpdateUserAsync(User UserEdit, int userID)
        {
            var user = await _dbContext.User.FindAsync(userID);

            user.Username = UserEdit.Username;
            user.Password = UserEdit.Password;
            user.Role_ID = UserEdit.Role_ID;

            user.Role = new Role();

            Role existingRole = await _dbContext.Role.FirstOrDefaultAsync(c => c.Name == UserEdit.Role.Name);

            user.Role = existingRole;

            await _dbContext.SaveChangesAsync();

            return user;
        }

        public async Task<Employee> UpdateEmployeeAsync(Employee EmpEdit, int userID)
        {
            var employee = await _dbContext.Employee.FindAsync(userID);

            employee.EmployeeName = EmpEdit.EmployeeName;
            employee.EmployeeSurname = EmpEdit.EmployeeSurname;
            employee.CellPhone_Num = EmpEdit.CellPhone_Num;
            employee.Email = EmpEdit.Email;
            employee.Branch_ID = EmpEdit.Branch_ID;
            employee.Department_ID = EmpEdit.Department_ID;
            employee.Mandate_ID = EmpEdit.Mandate_ID;

            employee.User = new User();

            User existingUser = await _dbContext.User.FirstOrDefaultAsync(c => c.User_Id == EmpEdit.User_Id);

            employee.User = existingUser;

            await _dbContext.SaveChangesAsync();

            return employee;
        }

        public async Task<Admin> UpdateAdminAsync(Admin AdminEdit, int userID)
        {
            var admin = await _dbContext.Admin.FindAsync(userID);

            admin.AdminName = AdminEdit.AdminName;
            admin.AdminSurname = AdminEdit.AdminSurname;
            admin.CellPhone_Num = AdminEdit.CellPhone_Num;
            admin.Email = AdminEdit.Email;
           

            admin.User = new User();

            User existingUser = await _dbContext.User.FirstOrDefaultAsync(c => c.User_Id == AdminEdit.User_Id);

            admin.User = existingUser;

            await _dbContext.SaveChangesAsync();

            return admin;
        }

    }

}