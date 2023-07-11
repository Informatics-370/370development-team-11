using ProcionAPI.Models.Entities;

namespace ProcionAPI.Models.Repositories
{
    public interface IDelegationRepository
    {
        Task<Delegation_Of_Authority[]> GetAllDelegationsAsync();
    }
}
