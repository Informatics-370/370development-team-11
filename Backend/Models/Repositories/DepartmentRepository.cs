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



        public async Task<Department> GetDepartmentAsync(int Department_ID)
        {
            IQueryable<Department> query = _dbContext.Department.Where(c => c.Department_ID == Department_ID);
            return await query.FirstOrDefaultAsync();
        }



       

        public async Task<Department> DepartmentValidationAsync(string name)
        {
            Department ExistingDepartment = await _dbContext.Department.FirstOrDefaultAsync(x => x.Name == name);
            if (ExistingDepartment != null)
            {
                return ExistingDepartment;
            }

            else
            {
                return null;
            }
        }
        public async Task<Department> EditDepartmentValidationAsync(string name, int id)
        {
            Department ExistingDepartment = await _dbContext.Department.FirstOrDefaultAsync(x => x.Name == name && x.Department_ID == id);
            if (ExistingDepartment != null)
            {
                return ExistingDepartment;
            }

            else
            {
                return null;
            }
        }
        public void Delete<T>(T entity) where T : class
        {
            _dbContext.Remove(entity);
        }

        public async Task<bool> SaveChangesAsync()
        {
            return await _dbContext.SaveChangesAsync() > 0;
        }

        public async Task<Employee> DepartmentDeleteUserValidationAsync(int id)
        {
            Employee ExistingUser = await _dbContext.Employee.FirstOrDefaultAsync(x => x.Department_ID == id);
            if (ExistingUser != null)
            {
                return ExistingUser;
            }

            else
            {
                return null;
            }
        }

        public async Task<Budget_Allocation> DepartmentDeleteBudgetAllocationValidationAsync(int id)
        {
            Budget_Allocation ExistingDep = await _dbContext.Budget_Allocation.FirstOrDefaultAsync(x => x.Department_ID == id);
            if (ExistingDep != null)
            {
                return ExistingDep;
            }

            else
            {
                return null;
            }
        }

    }
}
