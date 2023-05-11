using ProcionAPI.Models.Entities;

namespace ProcionAPI.Models.Repositories { 
    public interface IUserRepository {
        Task<Employee[]> GetAllEmployeesAsync();
        Task<User[]> GetAllUsersAsync();
        Task<Employee[]> AddEmployeeAsync(Employee EmployeeAdd, string usrName, string brName, string depName, int mlAmount);
        Task<User[]> AddUserAsync(User UserAdd, string name);
        Task<Employee> GetEmployeeAsync(int userID);
        Task<User> GetUserAsync(int userID);
        Task<Admin[]> GetAllAdminsAsync();
        Task<Admin> GetAdminAsync(int userID);
        Task<Admin[]> AddAdminAsync(Admin AdminAdd, string usrName);
        Task<bool> SaveChangesAsync();
        void Delete<T>(T entity) where T : class;
    }
}