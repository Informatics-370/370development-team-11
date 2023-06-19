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
        Task<Admin[]> GetAllAdminsAsync();
        Task<Admin> GetAdminAsync(int userID);
        Task<Admin> GetAdminByUserNameAsync(string username);
        Task<Admin[]> AddAdminAsync(Admin AdminAdd);
        Task<bool> SaveChangesAsync();
        void Delete<T>(T entity) where T : class;
        Task<User> UpdateUserAsync(User UserEdit, int userID);
        Task<Employee> UpdateEmployeeAsync(Employee EmpEdit, int userID);
        Task<Admin> UpdateAdminAsync(Admin AdminEdit, int userID);
        Task<User> UserValidationAsync(string name, int id);
        Task<User> Login(string Username, string Password);
        Task<bool> VerifyCredentials(string UserName, string Password);
        Task<User> GetUserByUsername(string username);
        Task<Employee> GetEmployeeByEmailAsync(string Email);
        Task<User> UpdateUserPassword(int userID, string NewPassword);
    }
}