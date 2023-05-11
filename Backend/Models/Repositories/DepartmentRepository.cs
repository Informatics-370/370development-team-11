using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using ProcionAPI.Data;
using ProcionAPI.Models.Entities;
using ProcionAPI.Controllers;

namespace ProcionAPI.Models.Repositories
{
    public class DepartmentRepository: IDepartmentRepository
    {

        private readonly AppDBContext _dbContext;
        
        public DepartmentRepository(AppDBContext dBContext)
        {
            _dbContext = dBContext;
        }


        public async Task<Department[]> GetAllDepartmentsAsync()
        {
            IQueryable<Department> query = _dbContext.Department;
            return await query.ToArrayAsync();
        }

        public async Task<Department[]> AddDepartmentAsync(Department AddDepartment)
        {
            
            // Add the Department to the database and save changes
            await _dbContext.Department.AddAsync(AddDepartment);
            await _dbContext.SaveChangesAsync();

            return new Department[] { AddDepartment };
        }

        public async Task<Department> EditDepartmentAsync(int Department_ID, Department Request)
        {
            var department = await _dbContext.Department.FindAsync(Department_ID);

            department.Name = Request.Name;
            department.Description = Request.Description;  

            await _dbContext.SaveChangesAsync();

            return department;
        }

        public async Task<Department> DeleteDepartmentAsync(int Department_ID)
        {
           var deleteDepartment = await _dbContext.Department.FindAsync(Department_ID);
            _dbContext.Department.Remove(deleteDepartment);
            await _dbContext.SaveChangesAsync();
            return deleteDepartment;
        }
        

        public async Task<Department> GetDepartmentAsync(int Department_ID)
        {
            Department department = await _dbContext.Department.FirstOrDefaultAsync(x => x.Department_ID == Department_ID);
            return department;
        }
    }
}
