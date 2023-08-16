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
                .Where(x => x.Notification_Type.Name.Contains("Vendor"));

            return await query.ToArrayAsync();
        }

        public async Task<Notification[]> GetTempVendorNotificationsAsync(string tempUsername)
        {
            IQueryable<Notification> query = _dbContext.Notification
                .Include(nt => nt.Notification_Type).Include(u => u.User)
                .Where(ui => ui.User.Username == tempUsername)
                .Where(x => x.Notification_Type.Name.Contains("Vendor"));

            return await query.ToArrayAsync();
        }

        public async Task<Notification[]> GetInventoryNotificationsAsync(string username)
        {
            IQueryable<Notification> query = _dbContext.Notification
                .Include(nt => nt.Notification_Type).Include(u => u.User)
                .Where(ui => ui.User.Username == username)
                .Where(x => x.Notification_Type.Name.Contains("Inventory"));

            return await query.ToArrayAsync();
        }

        public async Task<Notification[]> GetTempInventoryNotificationsAsync(string tempUsername)
        {
            IQueryable<Notification> query = _dbContext.Notification
                .Include(nt => nt.Notification_Type).Include(u => u.User)
                .Where(ui => ui.User.Username == tempUsername)
                .Where(x => x.Notification_Type.Name.Contains("Inventory"));

            return await query.ToArrayAsync();
        }

        public async Task<Notification[]> GetProcurementNotificationsAsync(string username)
        {
            IQueryable<Notification> query = _dbContext.Notification
                .Include(nt => nt.Notification_Type).Include(u => u.User)
                .Where(ui => ui.User.Username == username)
                .Where(x => x.Notification_Type.Name.Contains("Procurement"));

            return await query.ToArrayAsync();
        }

        public async Task<Notification[]> GetTempProcurementNotificationsAsync(string tempUsername)
        {
            IQueryable<Notification> query = _dbContext.Notification
                .Include(nt => nt.Notification_Type).Include(u => u.User)
                .Where(ui => ui.User.Username == tempUsername)
                .Where(x => x.Notification_Type.Name.Contains("Procurement"));

            return await query.ToArrayAsync();
        }

        public async Task<Notification[]> GetDelegationNotificationsAsync(string username)
        {
            IQueryable<Notification> query = _dbContext.Notification
                .Include(nt => nt.Notification_Type).Include(u => u.User)
                .Where(ui => ui.User.Username == username)
                .Where(x => x.Notification_Type.Name.Contains("Delegation of Authority"));

            return await query.ToArrayAsync();
        }

        public async Task<Notification[]> GetTempDelegationNotificationsAsync(string tempUsername)
        {
            IQueryable<Notification> query = _dbContext.Notification
                .Include(nt => nt.Notification_Type).Include(u => u.User)
                .Where(ui => ui.User.Username == tempUsername)
                .Where(x => x.Notification_Type.Name.Contains("Delegation of Authority"));

            return await query.ToArrayAsync();
        }

        public async Task<Notification[]> GetNotificationByUserIDAsync(int userID)
        {
            IQueryable<Notification> query = _dbContext.Notification
                .Include(nt => nt.Notification_Type).Include(u => u.User)
                .Where(ui => ui.User_Id == userID);

            return await query.ToArrayAsync();
        }

        public void Delete<T>(T entity) where T : class
        {
            _dbContext.Remove(entity);
        }

        public async Task<bool> SaveChangesAsync()
        {
            return await _dbContext.SaveChangesAsync() > 0;
        }
    }
}
