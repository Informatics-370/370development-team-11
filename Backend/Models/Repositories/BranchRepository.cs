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

        public async Task<Branch> EditBranchAsync(int Branch_ID, Branch Request)
        {
            var branch = await _dbContext.Branch.FindAsync(Branch_ID);

            branch.Name = Request.Name;
            branch.Street = Request.Street;
            branch.City = Request.City;
            branch.Postal_Code = Request.Postal_Code;
            branch.Province = Request.Province;

            await _dbContext.SaveChangesAsync();

            return branch;
        }

        public async Task<Branch> DeleteBranchAsync(int Branch_ID)
        {
            var deleteBranch = await _dbContext.Branch.FindAsync(Branch_ID);
            _dbContext.Branch.Remove(deleteBranch);
            await _dbContext.SaveChangesAsync();
            return deleteBranch;
        }


        public async Task<Branch> GetBranchAsync(int Branch_ID)
        {
            Branch branch = await _dbContext.Branch.FirstOrDefaultAsync(x => x.Branch_ID == Branch_ID);
            return branch;
        }
    }
}