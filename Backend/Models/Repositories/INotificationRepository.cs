using ProcionAPI.Models.Entities;

namespace ProcionAPI.Models.Repositories
{
    public interface INotificationRepository
    {
        Task<Notification[]> GetNotificationsAsync(string username);
        Task<Notification[]> GetVendorNotificationsAsync(string username);
        Task<Notification[]> GetInventoryNotificationsAsync(string username);
        Task<Notification[]> GetProcurementNotificationsAsync(string username);
    }
}
