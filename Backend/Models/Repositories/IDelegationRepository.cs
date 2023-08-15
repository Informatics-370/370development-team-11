using ProcionAPI.Models.Entities;

namespace ProcionAPI.Models.Repositories
{
    public interface IDelegationRepository
    {
        Task<Delegation_Of_Authority[]> GetAllDelegationsAsync();
        Task<Delegation_Of_Authority[]> GetAllDelegationsByRoleAsync();
        Task<Delegation_Of_Authority[]> GetAllActiveDelegationsAsync();
        Task<Delegation_Of_Authority[]> AddDelegationAsync(Delegation_Of_Authority DelegationAdd);
        Task<Delegation_Of_Authority> GetDelegationAsync(int delegationID);
        Task<Delegation_Of_Authority> DeleteDelegationAsync(int delegationID);
        Task<Delegation_Of_Authority> UpdateDelegationAsync(Delegation_Of_Authority DelegationUpdate, int delegationID);
        Task<Delegation_Of_Authority> UpdateDelegationStatusAsync(int statusID, int delegationID);
        //Task<Delegation_Of_Authority> EditDelegationStatusAsync(int delegationID);
        Task<Delegation_Status[]> GetAllRejStatusesAsync();
        Task<Delegation_Status[]> GetAllStatusesAsync();
        Task<Delegation_Status> GetRevokeStatusAsync();
        Task<Temporary_Access[]> AddTempAccAsync(Temporary_Access TempAccAdd);
        Task<Temporary_Access> GetTempAccAsync(int delegationID);
        Task<Temporary_Access> GetLoginTempAccAsync(int delegationID);
        Task<Temporary_Access> UpdateTempAccAsync(Temporary_Access UpdatedTempAcc, int tempAccID);
        void Delete<T>(T entity) where T : class;
        Task<bool> SaveChangesAsync();
        Task<Notification[]> AddActiveNotificationaAsync(int userID, Notification newNotification, Delegation_Of_Authority delegation);
        Task<Notification[]> AddRevokeNotificationaAsync(int userID, Notification newNotification, Delegation_Of_Authority delegation);
    }
}
