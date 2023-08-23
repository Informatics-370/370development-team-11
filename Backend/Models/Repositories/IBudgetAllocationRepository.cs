using ProcionAPI.Models.Entities;

namespace ProcionAPI.Models.Repositories
{
    public interface IBudgetAllocationRepository
    {
        Task<Budget_Category[]> GetAllBudgetCategoriesAsync();
        Task<Budget_Category> GetBudgetCategoryAsync(int budgetCategoryId);
        Task<Budget_Allocation[]> GetAllBudgetAllocationsAsync();
        Task<Budget_Allocation[]> GetDepBudgetAllocationAsync(string dep);
        Task<Budget_Allocation> GetBudgetAllocationAsync(int budgetAllocationId);
        Task<Budget_Line[]> GetAllBudgetLinesAsync();
        Task<Budget_Line[]> GetBudgetLinesForAllocationAsync(int budgetAllocationId);
        Task<Budget_Line> GetBudgetLineAsync(string accountCode);
        Task<Budget_Line> GetBudgetLineByIDAsync(int budgetLineID);
        Task<Budget_Allocation[]> AddBudgetAllocationAsync(Budget_Allocation budget_Allocation);
        Task<Budget_Line[]> AddBudgetLineAsync(Budget_Line budget_Line);
        Task<Budget_Line> UpdateBudgetLineAsync(Budget_Line budget_Line, string accountCode);
        Task<Budget_Category> BudgetCategoryValidationAsync(string name);
        Task<Budget_Allocation> BudgetAllocationValidationAsync(string departmentName, int year);
        Task<Budget_Line[]> GetBudgetAllocationExportAsync(int budgetAllocationId);
        Task<Budget_Line[]> GetBudgetAllocationExportForMonthAsync(int budgetAllocationId, string month);
        Task<Budget_Line> BudgetAllocationMonthExportValidationAsync(int budgetAllocationId, string month);
        Task<Budget_Line> BudgetAllocationExportValidationAsync(int budgetAllocationId);
        Task<Dictionary<string, (decimal variance, decimal actualAmt, decimal budgetedAmt)>> GetVarianceByDepartmentAsync();
        Task<IEnumerable<Budget_Line>> GetMonthlyBudgetDataForCategory(int year);
        Task<Dictionary<string, decimal>> GetYearlyTotalsForCategories(int year);
        Task<Dictionary<string, decimal>> GetMonthlyTotals(int year);

        void Add<T>(T entity) where T : class;
        void Delete<T>(T entity) where T : class;
        Task<bool> SaveChangesAsync();
    }
}
