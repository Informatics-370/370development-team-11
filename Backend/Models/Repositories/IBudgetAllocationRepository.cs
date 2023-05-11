using ProcionAPI.Models.Entities;

namespace ProcionAPI.Models.Repositories
{
    public interface IBudgetAllocationRepository
    {
        Task<Budget_Category[]> GetAllBudgetCategoriesAsync();
        Task<Budget_Category> GetBudgetCategoryAsync(int budgetCategoryId);
        Task<Budget_Allocation[]> GetAllBudgetAllocationsAsync();
        Task<Budget_Allocation> GetBudgetAllocationAsync(int budgetAllocationId);
        Task<Budget_Line[]> GetAllBudgetLinesAsync();
        Task<Budget_Line> GetBudgetLineAsync(int budgetLineId);
        void Add<T>(T entity) where T : class;
        void Delete<T>(T entity) where T : class;
        Task<bool> SaveChangesAsync();
    }
}
