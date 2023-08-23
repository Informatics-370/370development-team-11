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
        
        public UserRepository()
        {
        }

        public async Task<Employee[]> GetAllEmployeesAsync()
        {
            IQueryable<Employee> query = _dbContext.Employee.Include(c => c.Branch)
                .Include(d => d.Department)
                .Include(m => m.Mandate_Limit)
                .Include(u => u.User)
                .ThenInclude(a => a.Access)
                .Include(u => u.User)
                .ThenInclude(r => r.Role);


            return await query.ToArrayAsync();
        }

        public async Task<User[]> GetAllUsersAsync()
        {
            IQueryable<User> query = _dbContext.User.Include(c => c.Role).Include(a => a.Access);
                


            return await query.ToArrayAsync();
        }

        public async Task<User[]> AddUserAsync(User UserAdd)
        {

            Role existingRole = await _dbContext.Role.FirstOrDefaultAsync(u => u.Name == UserAdd.Role.Name);
            string Pass = HashPassword(UserAdd.Password);
            UserAdd.Password = Pass;

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
                .Include(u => u.User)
                .ThenInclude(a => a.Access)
                .Where(w => w.User.User_Id == userID);


            return await query.FirstOrDefaultAsync();
        }
        public async Task<Employee> GetEmployeeByEmailAsync(string Email)
        {
            IQueryable <Employee> Query = _dbContext.Employee.Include(U => U.User).Where(c => c.Email == Email);
            if (Query != null)
            {
                return await Query.FirstOrDefaultAsync();
            }
            else
            {
                return null;
            }
        }

        public async Task<Admin> GetAdminByEmailAsync(string Email)
        {
            IQueryable<Admin> Query = _dbContext.Admin.Include(U => U.User).Where(c => c.Email == Email);
            if (Query != null)
            {
                return await Query.FirstOrDefaultAsync();
            }
            else
            {
                return null;
            }
        }

        public async Task<Employee> GetEmployeeByUserNameAsync(string username)
        {
            IQueryable<Employee> query = _dbContext.Employee
                .Include(c => c.Branch)
                .Include(d => d.Department)
                .Include(m => m.Mandate_Limit)
                .Include(u => u.User)
                .ThenInclude(r => r.Role)
                .Include(u => u.User)
                .ThenInclude(a => a.Access)
                .Where(w => w.User.Username == username);


            return await query.FirstOrDefaultAsync();
        }

        public void Delete<T>(T entity) where T : class
        {
            _dbContext.Remove(entity);
        }

        public async Task<User> GetUserAsync(int userID)
        {
            IQueryable<User> query = _dbContext.User.Include(c => c.Role).Include(a => a.Access)
                .Where(w => w.User_Id == userID);


            return await query.FirstOrDefaultAsync();
        }

        public async Task<User> GetUserByUserNameAsync(string username)
        {
            IQueryable<User> query = _dbContext.User
                .Include(r => r.Role)
                .Include(a => a.Access)
                .Where(w => w.Username == username);


            return await query.FirstOrDefaultAsync();
        }

        public async Task<User> Login(string Username, string Password)
        {
            IQueryable<User> query = _dbContext.User.Include(c => c.Role).Include(a => a.Access)
                .Where(w => w.Username == Username && w.Password == Password);


            if (query != null)
            {
                return await query.FirstOrDefaultAsync();
            }
            else
            {
                return null;
            }
        }

        public async Task<Admin[]> GetAllAdminsAsync()
        {
            IQueryable<Admin> query = _dbContext.Admin
                .Include(u => u.User)
                .ThenInclude(r => r.Role)
                .Include(u => u.User)
                .ThenInclude(a => a.Access);


            return await query.ToArrayAsync();
        }

        public async Task<Admin> GetAdminAsync(int userID)
        {
            IQueryable<Admin> query = _dbContext.Admin
                .Include(u => u.User)
                .ThenInclude(r => r.Role)
                .Include(u => u.User)
                .ThenInclude(a => a.Access)
                .Where(w => w.User.User_Id == userID);


            return await query.FirstOrDefaultAsync();
        }

        public async Task<Admin> GetAdminByUserNameAsync(string username)
        {
            IQueryable<Admin> query = _dbContext.Admin
                .Include(u => u.User)
                .ThenInclude(r => r.Role)
                .Include(u => u.User)
                .ThenInclude(a => a.Access)
                .Where(w => w.User.Username == username);


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

        public async Task<User> CreateUserValidationAsync(string name)
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

        public async Task<Employee> CreateUserRoleValidationAsync(string department, string role)
        {
            Employee ExistingUser = await _dbContext.Employee.FirstOrDefaultAsync(x => x.User.Role.Name == role && x.Department.Name == department);

            if (ExistingUser != null)
            {
                return ExistingUser;
            }

            else
            {
                return null;
            }
        }

        public async Task<User> EditUserValidationAsync(string name, int id)
        {
            User ExistingUser = await _dbContext.User.FirstOrDefaultAsync(x => x.Username == name && x.User_Id == id);
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
            user.Profile_Picture = UserEdit.Profile_Picture;

            user.Access_ID = UserEdit.Access_ID;
            user.Access = UserEdit.Access;

            //user.Access.CanAccFin = UserEdit.Access.CanAccFin;
            //user.Access.CanAccInv = UserEdit.Access.CanAccInv;
            //user.Access.CanAccPro = UserEdit.Access.CanAccPro;
            //user.Access.CanAccRep = UserEdit.Access.CanAccRep;
            //user.Access.CanAccVen = UserEdit.Access.CanAccVen;
            //user.Access.CanAppVen = UserEdit.Access.CanAppVen;
            //user.Access.CanDeleteVen = UserEdit.Access.CanDeleteVen;
            //user.Access.CanEditVen = UserEdit.Access.CanEditVen;
            //user.Access.CanViewFinPro = UserEdit.Access.CanViewFinPro;
            //user.Access.CanViewFlagPro = UserEdit.Access.CanViewFlagPro;
            //user.Access.CanViewPenPro = UserEdit.Access.CanViewPenPro;

            user.Role = new Role();

            Role existingRole = await _dbContext.Role.FirstOrDefaultAsync(c => c.Name == UserEdit.Role.Name);

            user.Role = existingRole;

            await _dbContext.SaveChangesAsync();

            return user;
        }

        public async Task<User> UpdateUserPassword(int userID, string NewPassword)
        {
            var user = await _dbContext.User.FindAsync(userID);

            user.Password = HashPassword(NewPassword);

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

        public async Task<User> GetUserByUsername(string username)
        {
            var ExistingUser = _dbContext.User.Include(u => u.Role).Include(a => a.Access).FirstOrDefault(c => c.Username == username);
            return ExistingUser;
        }

        

        public async Task<bool> VerifyCredentials(string UserName, string Password)
        {
            var ExistingUser = await _dbContext.User.FirstOrDefaultAsync(c => c.Username == UserName);

            if (ExistingUser != null)
            {

                var Mypass = ExistingUser.Password;
                // UserName Exists
                bool isPasswordValid = BCrypt.Net.BCrypt.Verify(Password, Mypass);
                return isPasswordValid;

            }
            return false;

        }

        public string HashPassword(string Password)
        {
            string salt = BCrypt.Net.BCrypt.GenerateSalt();
            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(Password, salt);
            return hashedPassword;
        }

        public async Task<User> ResetNumNotifications(string username)
        {
            var user = await GetUserByUsername(username);

            user.No_Notifications = 0;

            await _dbContext.SaveChangesAsync();

            return user;
        }
        public async Task<AuditLog[]> AddLogAsync(AuditLog LogAdd)
        {


            await _dbContext.AuditLog.AddAsync(LogAdd);
            await _dbContext.SaveChangesAsync();

            return new AuditLog[] { LogAdd };
        }

        public async Task<AuditLog[]> GetAllLogsAsync()
        {
            IQueryable<AuditLog> query = _dbContext.AuditLog;
            query = query.OrderByDescending(log => log.ActionTime);
            return await query.ToArrayAsync();
        }

        public async Task<Notification> UserDeleteNotificationValidationAsync(int id)
        {
            Notification ExistingUser = await _dbContext.Notification.FirstOrDefaultAsync(x => x.User_Id == id);
            if (ExistingUser != null)
            {
                return ExistingUser;
            }

            else
            {
                return null;
            }
        }

        public async Task<Delegation_Of_Authority> UserDeleteDelegationValidationAsync(int id, string username)
        {
            Delegation_Of_Authority ExistingDelegateUser = await _dbContext.Delegation_Of_Authority.FirstOrDefaultAsync(x => x.User_Id == id);
            Delegation_Of_Authority ExistingDelegatingUser = await _dbContext.Delegation_Of_Authority.FirstOrDefaultAsync(x => x.DelegatingParty == username);
            if (ExistingDelegateUser != null)
            {
                return ExistingDelegateUser;
            }
            else if (ExistingDelegatingUser != null)
            {
                return ExistingDelegatingUser;
            }
            else
            {
                return null;
            }
        }

        public async Task<Procurement_Request> UserDeleteProcurementRequestValidationAsync(int id)
        {
            Procurement_Request ExistingUser = await _dbContext.Procurement_Request.FirstOrDefaultAsync(x => x.User_ID == id);
            if (ExistingUser != null)
            {
                return ExistingUser;
            }

            else
            {
                return null;
            }
        }

        public async Task<Onboard_Request> UserDeleteOnboardRequestValidationAsync(int id)
        {
            Onboard_Request ExistingUser = await _dbContext.Onboard_Request.FirstOrDefaultAsync(x => x.User_Id == id);
            if (ExistingUser != null)
            {
                return ExistingUser;
            }

            else
            {
                return null;
            }
        }

        public async Task<Procurement_Details> EmployeeDeleteProcurementDetailsValidationAsync(int id)
        {
            Procurement_Details ExistingUser = await _dbContext.Procurement_Details.FirstOrDefaultAsync(x => x.EmployeeID == id);
            if (ExistingUser != null)
            {
                return ExistingUser;
            }
            else
            {
                return null;
            }
        }

        public async Task<Delegation_Of_Authority> AdminDeleteDelegationValidationAsync(int id)
        {
            Delegation_Of_Authority ExistingUser = await _dbContext.Delegation_Of_Authority.FirstOrDefaultAsync(x => x.Admin_ID == id);
            if (ExistingUser != null)
            {
                return ExistingUser;
            }

            else
            {
                return null;
            }
        }

    }

}