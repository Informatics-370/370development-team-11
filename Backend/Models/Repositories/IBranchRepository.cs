using ProcionAPI.Models.Entities;

namespace ProcionAPI.Models.Repositories
{
    public interface IBranchRepository
    {
        Task<Branch[]> GetAllBranchesAsync();
        Task<Branch[]> AddBranchAsync(Branch AddBranch);
        Task<Branch> GetBranchAsync(int Branch_ID);
        Task<Branch> EditBranchAsync(int Branch_ID, Branch Request);
        Task<Branch> DeleteBranchAsync(int Branch_ID);
    }
}
