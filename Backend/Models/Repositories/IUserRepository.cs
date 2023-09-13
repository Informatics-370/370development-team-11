using Microsoft.AspNetCore.Mvc;
using ProcionAPI.Models.Entities;

namespace ProcionAPI.Models.Repositories { 
    public interface IUserRepository {
        Task<Employee[]> GetAllEmployeesAsync();
        Task<User[]> GetAllUsersAsync();
        Task<Employee[]> AddEmployeeAsync(Employee EmployeeAdd);
        Task<User[]> AddUserAsync(User UserAdd);
        Task<Employee> GetEmployeeAsync(int userID);
        Task<Employee> GetEmployeeByUserNameAsync(string username);
        Task<User> GetUserAsync(int userID);
        Task<User> GetUserByUserNameAsync(string username);
        Task<User> GetUserByRoleAsync(string role);
        Task<Admin[]> GetAllAdminsAsync();
        Task<Admin> GetAdminAsync(int userID);
        Task<Admin> GetAdminByUserNameAsync(string username);
        Task<Admin[]> AddAdminAsync(Admin AdminAdd);
        Task<bool> SaveChangesAsync();
        void Delete<T>(T entity) where T : class;
        Task<User> UpdateUserAsync(User UserEdit, int userID);
        Task<Employee> UpdateEmployeeAsync(Employee EmpEdit, int userID);
        Task<Admin> UpdateAdminAsync(Admin AdminEdit, int userID);
        Task<User> Login(string Username, string Password);
        Task<User> GetUserByUsername(string username);
        Task<Employee> GetEmployeeByEmailAsync(string Email);
        Task<User> UpdateUserPassword(int userID, string NewPassword);
        Task<Admin> GetAdminByEmailAsync(string Email);
        Task<User> ResetNumNotifications(string username);
        Task<AuditLog[]> AddLogAsync(AuditLog LogAdd);
        Task<AuditLog[]> GetAllLogsAsync();
        Task<Employee> GetEmployeeByDepartmentAsync(string dep);
        Task<Access> GetAccessAsync(int accID);
        Task<User> GetDeleteUserAsync(int userID);

        //---------------------------------------------------------------------------VALIDATION------------------------------------------------------------------------------------
        Task<User> EditUserValidationAsync(string name, int id);
        Task<User> CreateUserValidationAsync(string name, string cellphoneNum, string Type);
        Task<Employee> CreateUserRoleValidationAsync(string department, string role);
        Task<Employee> CreateUserMDRoleValidationAsync(string role);
        Task<bool> VerifyCredentials(string UserName, string Password);
        Task<Delegation_Of_Authority> AdminDeleteDelegationValidationAsync(int id);
        Task<Procurement_Details> EmployeeDeleteProcurementDetailsValidationAsync(int id);
        Task<Onboard_Request> UserDeleteOnboardRequestValidationAsync(int id);
        Task<Procurement_Request> UserDeleteProcurementRequestValidationAsync(int id);
        Task<Delegation_Of_Authority> UserDeleteDelegationValidationAsync(int id, string username);
        Task<Notification> UserDeleteNotificationValidationAsync(int id);

    }
}