using ProcionAPI.Models.Entities;

namespace ProcionAPI.Models.Repositories
{
    public interface IBranchRepository
    {
        Task<Branch[]> GetAllBranchesAsync();
        Task<Branch[]> AddBranchAsync(Branch AddBranch);
        Task<Branch> GetBranchAsync(int Branch_ID);
        void Delete<T>(T entity) where T : class;
        Task<Branch> BranchValidationAsync(string street);
        Task<bool> SaveChangesAsync();
    }
}
