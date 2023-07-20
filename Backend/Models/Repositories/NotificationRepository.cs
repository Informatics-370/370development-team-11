using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using ProcionAPI.Data;
using ProcionAPI.Models.Entities;
using ProcionAPI.Controllers;

namespace ProcionAPI.Models.Repositories
{
    public class NotificationRepository : INotificationRepository
    {
        private readonly AppDBContext _dbContext;

        public NotificationRepository(AppDBContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<Notification[]> GetNotificationsAsync(string username)
        {
            IQueryable<Notification> query = _dbContext.Notification
                .Include(nt => nt.Notification_Type).Include(u => u.User)
                .Where(ui => ui.User.Username == username);

            return await query.ToArrayAsync();
        }

        public async Task<Notification[]> GetVendorNotificationsAsync(string username)
        {
            IQueryable<Notification> query = _dbContext.Notification
                .Include(nt => nt.Notification_Type).Include(u => u.User)
                .Where(ui => ui.User.Username == username)
                .Where(x => x.Name.Contains("Vendor"));

            return await query.ToArrayAsync();
        }

        public async Task<Notification[]> GetInventoryNotificationsAsync(string username)
        {
            IQueryable<Notification> query = _dbContext.Notification
                .Include(nt => nt.Notification_Type).Include(u => u.User)
                .Where(ui => ui.User.Username == username)
                .Where(x => x.Name.Contains("Inventory"));

            return await query.ToArrayAsync();
        }

        public async Task<Notification[]> GetProcurementNotificationsAsync(string username)
        {
            IQueryable<Notification> query = _dbContext.Notification
                .Include(nt => nt.Notification_Type).Include(u => u.User)
                .Where(ui => ui.User.Username == username)
                .Where(x => x.Name.Contains("Procurement"));

            return await query.ToArrayAsync();
        }

    }
}
