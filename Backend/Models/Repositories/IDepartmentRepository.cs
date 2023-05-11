using ProcionAPI.Models.Entities;

namespace ProcionAPI.Models.Repositories
{
    public interface IDepartmentRepository
    {

        Task<Department[]> GetAllDepartmentsAsync();
        Task<Department[]> AddDepartmentAsync(Department AddDepartment);
        Task<Department> GetDepartmentAsync(int Department_ID);
        Task<Department> EditDepartmentAsync(int Department_ID, Department Request);
        Task<Department> DeleteDepartmentAsync(int Department_ID);
    }
}
