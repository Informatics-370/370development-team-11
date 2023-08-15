using ProcionAPI.Models.Entities;

namespace ProcionAPI.Models.Repositories
{
    public interface INotificationRepository
    {
        Task<Notification[]> GetNotificationsAsync(string username);
        Task<Notification[]> GetVendorNotificationsAsync(string username);
        Task<Notification[]> GetTempVendorNotificationsAsync(string tempUsername);
        Task<Notification[]> GetInventoryNotificationsAsync(string username);
        Task<Notification[]> GetTempInventoryNotificationsAsync(string tempUsername);
        Task<Notification[]> GetProcurementNotificationsAsync(string username);
        Task<Notification[]> GetTempProcurementNotificationsAsync(string tempUsername);
        Task<Notification[]> GetDelegationNotificationsAsync(string username);
        Task<Notification[]> GetTempDelegationNotificationsAsync(string tempUsername);
    }
}
