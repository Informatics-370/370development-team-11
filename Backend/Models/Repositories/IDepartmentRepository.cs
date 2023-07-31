using ProcionAPI.Models.Entities;

namespace ProcionAPI.Models.Repositories
{
    public interface IDepartmentRepository
    {

        Task<Department[]> GetAllDepartmentsAsync();
        Task<Department[]> AddDepartmentAsync(Department AddDepartment);
        Task<Department> GetDepartmentAsync(int Department_ID);
        void Delete<T>(T entity) where T : class;
        Task<Department> DepartmentValidationAsync(string name);
        Task<Department> EditDepartmentValidationAsync(string name, int id);
        Task<bool> SaveChangesAsync();
    }
}
