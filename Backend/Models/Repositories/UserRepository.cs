using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using ProcionAPI.Data;
using ProcionAPI.Models.Entities;
using ProcionAPI.Controllers;
using Microsoft.Data.SqlClient;
using System.Data;

namespace ProcionAPI.Models.Repositories
{
    public class UserRepository : IUserRepository {
        private readonly AppDBContext _dbContext;
        private readonly IConfiguration _configuration;

        public UserRepository(AppDBContext dbContext, IConfiguration configuration)
        {
            _dbContext = dbContext;
            _configuration = configuration;
        }
        
        public UserRepository()
        {
        }

        public async Task<List<Employee>> GetAllEmployeesAsync()
        {
            List<Employee> employees = new List<Employee>();
            using (SqlConnection connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await connection.OpenAsync();
                {
                    using (SqlCommand command = new SqlCommand("GetAllEmployees", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;
                        using (SqlDataReader reader = await command.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                Employee employee = new Employee();
                                employee.EmployeeID = Convert.ToInt32(reader["EmployeeID"]);
                                employee.Branch_ID = Convert.ToInt32(reader["Branch_ID"]);
                                employee.Department_ID = Convert.ToInt32(reader["Department_ID"]);
                                employee.Mandate_ID = Convert.ToInt32(reader["Mandate_ID"]);
                                employee.User_Id = Convert.ToInt32(reader["User_Id"]);
                                employee.CellPhone_Num = reader["CellPhone_Num"].ToString();
                                employee.Email = reader["Email"].ToString();
                                employee.EmployeeName = reader["EmployeeName"].ToString();
                                employee.EmployeeSurname = reader["EmployeeSurname"].ToString();
                                employee.Branch = new Branch();
                                employee.Branch.Branch_ID = Convert.ToInt32(reader["Branch_ID"]);
                                employee.Branch.City = reader["City"].ToString();
                                employee.Branch.Name = reader["Branch_Name"].ToString();
                                employee.Branch.Postal_Code = reader["Postal_Code"].ToString();
                                employee.Branch.Province = reader["Province"].ToString();
                                employee.Branch.Street = reader["Street"].ToString();
                                employee.Department = new Department();
                                employee.Department.Department_ID = Convert.ToInt32(reader["Department_ID"]);
                                employee.Department.Name = reader["Department_Name"].ToString();
                                employee.Department.Description = reader["Department_Description"].ToString();
                                employee.Mandate_Limit = new Mandate_Limit();
                                employee.Mandate_Limit.Mandate_ID = Convert.ToInt32(reader["Mandate_ID"]);
                                employee.Mandate_Limit.Ammount = Convert.ToDouble(reader["Ammount"]);
                                employee.Mandate_Limit.Date = Convert.ToDateTime(reader["Date"]);
                                employee.User = new User();
                                employee.User.User_Id = Convert.ToInt32(reader["User_Id"]);
                                employee.User.Access_ID = Convert.ToInt32(reader["Access_ID"]);
                                employee.User.Role_ID = Convert.ToInt32(reader["Role_ID"]);
                                employee.User.No_Notifications = Convert.ToInt32(reader["No_Notifications"]);
                                employee.User.Username = reader["Username"].ToString();
                                employee.User.Password = reader["Password"].ToString();
                                employee.User.Profile_Picture = reader["Profile_Picture"].ToString();
                                employee.User.Role = new Role();
                                employee.User.Role.Role_ID = Convert.ToInt32(reader["Role_ID"]);
                                employee.User.Role.Name = reader["Role_Name"].ToString();
                                employee.User.Role.Description = reader["Role_Description"].ToString();
                                employee.User.Access = new Access();
                                employee.User.Access.Access_ID = Convert.ToInt32(reader["Access_ID"]);
                                employee.User.Access.Access_ID = (int)reader["Access_ID"];
                                employee.User.Access.IsAdmin = reader["IsAdmin"].ToString();
                                employee.User.Access.CanAccInv = reader["CanAccInv"].ToString();
                                employee.User.Access.CanAccPro = reader["CanAccPro"].ToString();
                                employee.User.Access.CanAccRep = reader["CanAccRep"].ToString();
                                employee.User.Access.CanAccVen = reader["CanAccVen"].ToString();
                                employee.User.Access.CanAppVen = reader["CanAppVen"].ToString();
                                employee.User.Access.CanAccFin = reader["CanAccFin"].ToString();
                                employee.User.Access.CanDeleteVen = reader["CanDeleteVen"].ToString();
                                employee.User.Access.CanEditVen = reader["CanEditVen"].ToString();
                                employee.User.Access.CanViewFinPro = reader["CanViewFinPro"].ToString();
                                employee.User.Access.CanViewFlagPro = reader["CanViewFlagPro"].ToString();
                                employee.User.Access.CanViewPenPro = reader["CanViewPenPro"].ToString();
                                employee.User.No_DelNotifications = Convert.ToInt32(reader["No_DelNotifications"]);
                                employee.User.No_ProNotifications = Convert.ToInt32(reader["No_ProNotifications"]);
                                employee.User.No_InvNotifications = Convert.ToInt32(reader["No_InvNotifications"]);
                                employee.User.No_VenNotifications = Convert.ToInt32(reader["No_VenNotifications"]);
                                employee.User.No_Notifications = Convert.ToInt32(reader["No_Notifications"]);
                                employees.Add(employee);




                            }
                        }
                    }
                }
            }
            return employees;
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
            IQueryable <Employee> Query = _dbContext.Employee.Include(U => U.User).Include(d => d.Department).Where(c => c.Email == Email);
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

        public async Task<User> GetDeleteUserAsync(int userID)
        {
            IQueryable<User> query = _dbContext.User.Include(c => c.Role)
                .Where(w => w.User_Id == userID);


            return await query.FirstOrDefaultAsync();
        }

        public async Task<Access> GetAccessAsync(int accID)
        {
            IQueryable<Access> query = _dbContext.Access.Where(w => w.Access_ID == accID);


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

        public async Task<Employee> GetEmployeeByDepartmentAsync(string dep)
        {
            IQueryable<Employee> Query = _dbContext.Employee.Where(c => c.Department.Name == dep && c.User.Role.Description == "Budget Owner");
            if (Query != null)
            {
                return await Query.FirstOrDefaultAsync();
            }
            else
            {
                return null;
            }
        }

        public async Task<User> GetUserByRoleAsync(string role)
        {
            IQueryable<User> query = _dbContext.User
                .Include(r => r.Role)
                .Include(a => a.Access)
                .Where(w => w.Role.Name == role);


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

        public async Task<List<Admin>> GetAllAdminsAsync()
        {
            List<Admin> admins = new List<Admin>();
            using (SqlConnection connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await connection.OpenAsync();
                {
                    using (SqlCommand command = new SqlCommand("GetAllAdmins", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;
                        using (SqlDataReader reader = await command.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                Admin admin = new Admin();
                                admin.Admin_ID = (int)reader["Admin_ID"];
                                admin.AdminName = reader["AdminName"].ToString();
                                admin.Email = reader["Email"].ToString();
                                admin.AdminSurname = reader["AdminSurname"].ToString();
                                admin.CellPhone_Num = reader["CellPhone_Num"].ToString();
                                admin.User_Id = (int)reader["User_Id"];
                                admin.User = new User();
                                admin.User.User_Id = (int)reader["User_Id"];
                                admin.User.Access_ID = (int)reader["Access_ID"];
                                admin.User.No_Notifications = (int)reader["No_Notifications"];
                                admin.User.Password = reader["Password"].ToString();
                                admin.User.Profile_Picture = reader["Profile_Picture"].ToString();
                                admin.User.Role_ID = (int)reader["Role_ID"];
                                admin.User.Username = reader["Username"].ToString();
                                admin.User.Role = new Role();
                                admin.User.Role.Role_ID = (int)reader["Role_ID"];
                                admin.User.Role.Description = reader["Description"].ToString();
                                admin.User.Role.Name = reader["Name"].ToString();
                                admin.User.Access = new Access();
                                admin.User.Access.Access_ID = (int)reader["Access_ID"];
                                admin.User.Access.IsAdmin = reader["IsAdmin"].ToString();
                                admin.User.Access.CanAccInv = reader["CanAccInv"].ToString();
                                admin.User.Access.CanAccPro = reader["CanAccPro"].ToString();
                                admin.User.Access.CanAccRep = reader["CanAccRep"].ToString();
                                admin.User.Access.CanAccVen = reader["CanAccVen"].ToString();
                                admin.User.Access.CanAppVen = reader["CanAppVen"].ToString();
                                admin.User.Access.CanAccFin = reader["CanAccFin"].ToString();
                                admin.User.Access.CanDeleteVen = reader["CanDeleteVen"].ToString();
                                admin.User.Access.CanEditVen = reader["CanEditVen"].ToString();
                                admin.User.Access.CanViewFinPro = reader["CanViewFinPro"].ToString();
                                admin.User.Access.CanViewFlagPro = reader["CanViewFlagPro"].ToString();
                                admin.User.Access.CanViewPenPro = reader["CanViewPenPro"].ToString();
                                admin.User.No_DelNotifications = Convert.ToInt32(reader["No_DelNotifications"]);
                                admin.User.No_ProNotifications = Convert.ToInt32(reader["No_ProNotifications"]);
                                admin.User.No_InvNotifications = Convert.ToInt32(reader["No_InvNotifications"]);
                                admin.User.No_VenNotifications = Convert.ToInt32(reader["No_VenNotifications"]);
                                admin.User.No_Notifications = Convert.ToInt32(reader["No_Notifications"]);

                                admins.Add(admin);
                            }
                        }
                    }
                }
            }
            return admins;
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

        public async Task<User> CreateUserValidationAsync(string name, string cellphoneNum, string Type)
        {
            if (Type == "Employee")
            {
                User ExistingUser = await _dbContext.User.FirstOrDefaultAsync(x => x.Username == name);
                Employee UserWithPHNUM = await _dbContext.Employee.FirstOrDefaultAsync(pn => pn.CellPhone_Num == cellphoneNum);


                if (ExistingUser != null || UserWithPHNUM != null)
                {
                    return ExistingUser;
                }
                else
                {
                    return null;
                }
            }

            else if (Type == "Admin")
            {
                User ExistingUser = await _dbContext.User.FirstOrDefaultAsync(x => x.Username == name);
                Admin UserWithPHNUM = await _dbContext.Admin.FirstOrDefaultAsync(pn => pn.CellPhone_Num == cellphoneNum);


                if (ExistingUser != null || UserWithPHNUM != null)
                {
                    return ExistingUser;
                }
                else
                {
                    return null;
                }
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

        public async Task<Employee> CreateUserMDRoleValidationAsync(string role)
        {
            Employee ExistingUser = await _dbContext.Employee.FirstOrDefaultAsync(x => x.User.Role.Name == role);

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
            User ExistingUser = await _dbContext.User.FirstOrDefaultAsync(x => x.Username == name);
            if (ExistingUser != null)
            {
                if (ExistingUser.User_Id == id)
                {
                    return null;
                }
                else
                {
                    return ExistingUser;
                }
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
            user.No_DelNotifications = 0;
            user.No_VenNotifications = 0;
            user.No_InvNotifications = 0;
            user.No_ProNotifications = 0;

            await _dbContext.SaveChangesAsync();

            return user;
        }
        public async Task<AuditLog[]> AddLogAsync(AuditLog LogAdd)
        {


            await _dbContext.AuditLog.AddAsync(LogAdd);
            await _dbContext.SaveChangesAsync();

            return new AuditLog[] { LogAdd };
        }

        public async Task<List<AuditLog>> GetAllLogsAsync()
        {
            List<AuditLog> logs = new List<AuditLog>();
            using (SqlConnection connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await connection.OpenAsync();
                {
                    using (SqlCommand command = new SqlCommand("GetAuditLogs", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;
                        using (SqlDataReader reader = await command.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                AuditLog log = new AuditLog();
                                log.Log_ID = Convert.ToInt32(reader["Log_ID"]);
                                log.Action = reader["Action"].ToString();
                                log.ActionTime = Convert.ToDateTime(reader["ActionTime"]);
                                log.User = reader["User"].ToString();

                                logs.Add(log);
                            }
                        }
                    }
                }
            }

            return logs;
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

        public async Task<UserSettings> GetTimerDurationAsync()
        {
            UserSettings query = await _dbContext.UserSettings.FirstOrDefaultAsync(I => I.Setting_ID == 1);


            return query;
        }

        public async Task<UserSettings> UpdateTimerAsync(int ID,int NewTime)
        {
            var Timer = await _dbContext.UserSettings.FirstOrDefaultAsync(x => x.Setting_ID == ID);

            Timer.TimerDuration = NewTime;

            await _dbContext.SaveChangesAsync();

            return Timer;
        }

        public async Task<VAT> GetVATAsync()
        {
            VAT query = await _dbContext.VAT.FirstOrDefaultAsync(I => I.VatID == 1);


            return query;
        }

        public async Task<VAT[]> AddVATAsync(VAT VATAdd)
        {
            await _dbContext.VAT.AddAsync(VATAdd);
            await _dbContext.SaveChangesAsync();

            return new VAT[] { VATAdd };
        }

        public async Task<VAT> EditVATAsync(VAT VATEdit)
        {
            var vat = await _dbContext.VAT.FindAsync(1);

            vat.Percentage = VATEdit.Percentage;
            vat.Date = VATEdit.Date;

            await _dbContext.SaveChangesAsync();

            return vat;
        }
    }

    

}