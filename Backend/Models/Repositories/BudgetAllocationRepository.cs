using ProcionAPI.Data;
using ProcionAPI.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.ML;

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
        public async Task<Budget_Allocation[]> GetDepBudgetAllocationAsync(string dep)
        {
            IQueryable<Budget_Allocation> query = _dbContext.Budget_Allocation.Include(c => c.Department).Where(d => d.Department.Name == dep);
            return await query.ToArrayAsync();
        }
        public async Task<Budget_Allocation> GetBudgetAllocationAsync(int budgetAllocationId)
        {
            IQueryable<Budget_Allocation> query = _dbContext.Budget_Allocation.Include(c => c.Department).Where(c => c.Budget_ID == budgetAllocationId);
            return await query.FirstOrDefaultAsync();
        }
        public async Task<Budget_Line[]> GetAllBudgetLinesAsync()
        {
            IQueryable<Budget_Line> query = _dbContext.Budget_Line.Include(b => b.Budget_Allocation).ThenInclude(a => a.Department).Include( c => c.Budget_Category);
            return await query.ToArrayAsync();
        }

        public async Task<Budget_Line[]> GetBudgetLinesForAllocationAsync(int budgetAllocationId)
        {
            IQueryable<Budget_Line> query = _dbContext.Budget_Line.Where(b => b.Budget_Allocation.Budget_ID == budgetAllocationId).Include(c => c.Budget_Category).Include(a => a.Budget_Allocation).ThenInclude(a => a.Department);
            return await query.ToArrayAsync();
        }

        public async Task<Budget_Line[]> GetBudgetAllocationExportAsync(int budgetAllocationId)
        {
            IQueryable<Budget_Line> query = _dbContext.Budget_Line.Where(b => b.Budget_Allocation.Budget_ID == budgetAllocationId).Include(c => c.Budget_Category).Include(a => a.Budget_Allocation).ThenInclude(a => a.Department).OrderBy(m => m.Month);
            return await query.ToArrayAsync();
        }

        public async Task<Budget_Line[]> GetBudgetAllocationExportForMonthAsync(int budgetAllocationId, string month)
        {
            IQueryable<Budget_Line> query = _dbContext.Budget_Line.Where(b => b.Budget_Allocation.Budget_ID == budgetAllocationId && b.Month == month).Include(c => c.Budget_Category).Include(a => a.Budget_Allocation).ThenInclude(a => a.Department).OrderBy(m => m.Month);
            return await query.ToArrayAsync();
        }

        public async Task<Budget_Line> GetBudgetLineAsync(string accountCode)
        {
            IQueryable<Budget_Line> query = _dbContext.Budget_Line.Where(c => c.Account_Code == accountCode).Include(c => c.Budget_Category).Include(b => b.Budget_Allocation).ThenInclude(a => a.Department);
            return await query.FirstOrDefaultAsync();
        }

        public async Task<Budget_Line> GetBudgetLineByIDAsync(int budgetLineID)
        {
            IQueryable<Budget_Line> query = _dbContext.Budget_Line.Where(c => c.BudgetLineId == budgetLineID).Include(c => c.Budget_Category).Include(b => b.Budget_Allocation).ThenInclude(a => a.Department);
            return await query.FirstOrDefaultAsync();
        }

        public async Task<Budget_Allocation[]> AddBudgetAllocationAsync(Budget_Allocation budgetAllocation)
        {
            Department existingDepartment = await _dbContext.Department.FirstOrDefaultAsync(d => d.Name == budgetAllocation.Department.Name);


            if (existingDepartment != null)
            {
                
                budgetAllocation.Department = existingDepartment;
            }

            await _dbContext.Budget_Allocation.AddAsync(budgetAllocation);
            await _dbContext.SaveChangesAsync();

            return new Budget_Allocation[] { budgetAllocation };
        }

        public async Task<Budget_Line[]> AddBudgetLineAsync(Budget_Line budgetLine)
        {
            Budget_Line existingLine = await _dbContext.Budget_Line.FirstOrDefaultAsync(d => d.Budget_Category.Account_Name == budgetLine.Budget_Category.Account_Name && d.Month == budgetLine.Month && d.Budget_ID == budgetLine.Budget_ID);
            
            if (existingLine != null)
            {
                return null;
            }
            else
            {
                Budget_Category existingBudgetCategory = await _dbContext.Budget_Category.FirstOrDefaultAsync(d => d.Account_Name == budgetLine.Budget_Category.Account_Name);
                Budget_Allocation existingBudgetAllocation = await _dbContext.Budget_Allocation.Include(b => b.Department).Where(a => a.Budget_ID == budgetLine.Budget_Allocation.Budget_ID).FirstOrDefaultAsync();

                if (existingBudgetCategory != null)
                {
                    budgetLine.Budget_Category = existingBudgetCategory;
                }

                if (existingBudgetAllocation != null)
                {
                    budgetLine.Budget_Allocation = existingBudgetAllocation;

                }

                await _dbContext.Budget_Line.AddAsync(budgetLine);
                await _dbContext.SaveChangesAsync();

                return new Budget_Line[] { budgetLine };
            }
            
            
        }
        public async Task<Budget_Line> UpdateBudgetLineAsync(Budget_Line budget_Line, string accountCode)
        {
            var budgetline = await _dbContext.Budget_Line.FindAsync(budget_Line.BudgetLineId);

            budgetline.Account_Code = budget_Line.Account_Code;
            budgetline.ActualAmt = budget_Line.ActualAmt;
            budgetline.BudgetAmt = budget_Line.BudgetAmt;
            budgetline.Budget_ID = budget_Line.Budget_ID;
            budgetline.Category_ID = budget_Line.Category_ID;
            budgetline.Month = budget_Line.Month;
            budgetline.Variance = budget_Line.Variance;

            budgetline.Budget_Allocation = new Budget_Allocation();
            budgetline.Budget_Category = new Budget_Category();

            Budget_Allocation existingBudgetAllocation = await _dbContext.Budget_Allocation.FirstOrDefaultAsync(ba => ba.Budget_ID == budget_Line.Budget_ID);
            Budget_Category exsitingBudgetCategory = await _dbContext.Budget_Category.FirstOrDefaultAsync(bc => bc.Category_ID == budget_Line.Category_ID);

            budgetline.Budget_Allocation = existingBudgetAllocation;
            budgetline.Budget_Category = exsitingBudgetCategory;

            await _dbContext.SaveChangesAsync();

            
            return budgetline;
        }

        public async Task<Budget_Category> BudgetCategoryValidationAsync(string name)
        {
            Budget_Category ExistingCategory = await _dbContext.Budget_Category.FirstOrDefaultAsync(x => x.Account_Name.ToLower() == name.ToLower());
            if (ExistingCategory != null)
            {
                return ExistingCategory;
            }

            else
            {
                return null;
            }
        }

        public async Task<Budget_Allocation> BudgetAllocationValidationAsync(string departmentName, int year)
        {
            Department ExistingDepartment = await _dbContext.Department.FirstOrDefaultAsync(x => x.Name.ToLower() == departmentName.ToLower());
            Budget_Allocation ExistingAllocation = await _dbContext.Budget_Allocation.FirstOrDefaultAsync(x => x.Department == ExistingDepartment && x.Year == year);

            if(ExistingAllocation != null)
            {
                return ExistingAllocation;
            }

            else
            {
                return null;
            }
        }

        public async Task<Budget_Line> BudgetAllocationMonthExportValidationAsync(int budgetAllocationId, string month)
        {
            Budget_Line ExistingAllocation = await _dbContext.Budget_Line.FirstOrDefaultAsync(x => x.Budget_ID == budgetAllocationId && x.Month == month);

            if (ExistingAllocation != null)
            {
                return ExistingAllocation;
            }

            else
            {
                return null;
            }
        }

        public async Task<Budget_Line> BudgetAllocationExportValidationAsync(int budgetAllocationId)
        {
            Budget_Line ExistingAllocation = await _dbContext.Budget_Line.FirstOrDefaultAsync(x => x.Budget_ID == budgetAllocationId);

            if (ExistingAllocation != null)
            {
                return ExistingAllocation;
            }

            else
            {
                return null;
            }
        }

        public async Task<Dictionary<string, (decimal variance, decimal actualAmt, decimal budgetedAmt)>> GetVarianceByDepartmentAsync()
        {
     
            var budgetLines = await GetAllBudgetLinesAsync();

            // Group by department's name and sum variances
            var groupedByDepartment = budgetLines.GroupBy(bl => bl.Budget_Allocation.Department.Name)
                                                .ToDictionary(
                                             g => g.Key,
                                             g => (
                                                 g.Sum(bl => bl.Variance),
                                                 g.Sum(bl => bl.ActualAmt),
                                                 g.Sum(bl => bl.BudgetAmt)
                                             ));
            return groupedByDepartment;
        }

        public async Task<Dictionary<string, decimal>> GetYearlyTotalsForCategories(int year)
        {
            return _dbContext.Budget_Line
                   .Include(b => b.Budget_Category)
                   .Where(b => b.Budget_Allocation.Year == year)
                   .GroupBy(b => b.Budget_Category.Account_Name)
                   .ToDictionary(g => g.Key, g => g.Sum(b => b.ActualAmt));
        }

        public async Task<Dictionary<string, decimal>> GetMonthlyTotals(int year)
        {
            return _dbContext.Budget_Line
                   .Where(b => b.Budget_Allocation.Year == year)
                   .GroupBy(b => b.Month)
                   .ToDictionary(g => g.Key.ToString(), g => g.Sum(b => b.ActualAmt));
        }

        public async Task <IEnumerable <Budget_Line>> GetMonthlyBudgetDataForCategory(int year)
        {
            return _dbContext.Budget_Line.Include(b => b.Budget_Category).Include(b => b.Budget_Allocation).ThenInclude(b => b.Department).Where(b => b.Budget_Allocation.Year == year).ToList();
        }
    



        public void Add<T>(T entity) where T : class { _dbContext.Add(entity); }

        public void Delete<T>(T entity) where T : class { _dbContext.Remove(entity); }

        public async Task<bool> SaveChangesAsync()
        {
            return await _dbContext.SaveChangesAsync() > 0;
        }
    }
}
