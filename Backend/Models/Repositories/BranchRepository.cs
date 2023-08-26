using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using ProcionAPI.Data;
using ProcionAPI.Models.Entities;
using ProcionAPI.Controllers;

namespace ProcionAPI.Models.Repositories
{
    public class BranchRepository : IBranchRepository
    {

        private readonly AppDBContext _dbContext;

        public BranchRepository(AppDBContext dBContext)
        {
            _dbContext = dBContext;
        }


        public async Task<Branch[]> GetAllBranchesAsync()
        {
            IQueryable<Branch> query = _dbContext.Branch;
            return await query.ToArrayAsync();
        }

        public async Task<Branch[]> AddBranchAsync(Branch AddBranch)
        {

            // Add the Department to the database and save changes
            await _dbContext.Branch.AddAsync(AddBranch);
            await _dbContext.SaveChangesAsync();

            return new Branch[] { AddBranch };
        }

        public async Task<Branch> GetBranchAsync(int Branch_ID)
        {
            IQueryable<Branch> query = _dbContext.Branch.Where(c => c.Branch_ID == Branch_ID);
            return await query.FirstOrDefaultAsync();
        }

       


        public async Task<Branch> BranchValidationAsync(string street)
        {
            Branch ExistingBranch = await _dbContext.Branch.FirstOrDefaultAsync(x => x.Name == street);
            if (ExistingBranch != null)
            {
                return ExistingBranch;
            }

            else
            {
                return null;
            }
        }
        public async Task<Branch> EditBranchValidationAsync(string street, int id)
        {
            Branch ExistingBranch = await _dbContext.Branch.FirstOrDefaultAsync(x => x.Name == street && x.Branch_ID == id);
            if (ExistingBranch != null)
            {
                return ExistingBranch;
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

        public async Task<Employee> BranchDeleteUserValidationAsync(int id)
        {
            Employee ExistingUser = await _dbContext.Employee.FirstOrDefaultAsync(x => x.Branch_ID == id);
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