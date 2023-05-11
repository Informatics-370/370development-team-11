using ProcionAPI.Data;
using ProcionAPI.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace ProcionAPI.Models.Repositories
{
    public class BudgetAllocationRepository: IBudgetAllocationRepository
    {
        private readonly AppDBContext _dbContext;

        public BudgetAllocationRepository(AppDBContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<Budget_Category[]> GetAllBudgetCategoriesAsync()
        {
            IQueryable<Budget_Category> query = _dbContext.Budget_Category;
            return await query.ToArrayAsync();
        }
        public async Task<Budget_Category> GetBudgetCategoryAsync(int budgetCategoryId)
        {
            IQueryable<Budget_Category> query = _dbContext.Budget_Category.Where(c => c.Category_ID == budgetCategoryId);
            return await query.FirstOrDefaultAsync();
        }

        public async Task<Budget_Allocation[]> GetAllBudgetAllocationsAsync()
        {
            IQueryable<Budget_Allocation> query = _dbContext.Budget_Allocation.Include(c => c.Department);
            return await query.ToArrayAsync();
        }
        public async Task<Budget_Allocation> GetBudgetAllocationAsync(int budgetAllocationId)
        {
            IQueryable<Budget_Allocation> query = _dbContext.Budget_Allocation.Where(c => c.Budget_ID == budgetAllocationId);
            return await query.FirstOrDefaultAsync();
        }
        public async Task<Budget_Line[]> GetAllBudgetLinesAsync()
        {
            IQueryable<Budget_Line> query = _dbContext.Budget_Line.Include(b => b.Budget_Allocation).Include( c => c.Budget_Category);
            return await query.ToArrayAsync();
        }
        public async Task<Budget_Line> GetBudgetLineAsync(int accountCode)
        {
            IQueryable<Budget_Line> query = _dbContext.Budget_Line.Where(c => c.Account_Code == accountCode);
            return await query.FirstOrDefaultAsync();
        }
        public void Add<T>(T entity) where T : class { _dbContext.Add(entity); }

        public void Delete<T>(T entity) where T : class { _dbContext.Remove(entity); }

        public async Task<bool> SaveChangesAsync()
        {
            return await _dbContext.SaveChangesAsync() > 0;
        }
    }
}
