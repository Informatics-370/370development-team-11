using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using ProcionAPI.Data;
using ProcionAPI.Models.Entities;
using ProcionAPI.Controllers;

namespace ProcionAPI.Models.Repositories
{
    public class DelegationRepository : IDelegationRepository
    {
        private readonly AppDBContext _dbContext;

        public DelegationRepository(AppDBContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<Delegation_Of_Authority[]> GetAllDelegationsAsync()
        {
            IQueryable<Delegation_Of_Authority> query = _dbContext.Delegation_Of_Authority
            .Include(u => u.User).Include(s => s.Delegation_Status).Include(a => a.Admin);

            return await query.ToArrayAsync();
        }

        public async Task<Delegation_Of_Authority[]> GetAllDelegationsByRoleAsync()
        {
            IQueryable<Delegation_Of_Authority> query = _dbContext.Delegation_Of_Authority
            .Include(u => u.User).Include(s => s.Delegation_Status).Include(a => a.Admin).Where(d => d.Delegation_Status.Name == "Awaiting Approval");

            return await query.ToArrayAsync();
        }

        public async Task<Delegation_Of_Authority[]> GetAllActiveDelegationsAsync()
        {
            IQueryable<Delegation_Of_Authority> query = _dbContext.Delegation_Of_Authority
            .Include(u => u.User).Include(s => s.Delegation_Status).Where(d => d.Delegation_Status.Name == "Active");

            return await query.ToArrayAsync();
        }

        public async Task<Delegation_Of_Authority[]> AddDelegationAsync(Delegation_Of_Authority DelegationAdd)
        {

            Delegation_Status existingStatus = await _dbContext.Delegation_Status.FirstOrDefaultAsync(s => s.Name == "Inactive");
            User existingUser = await _dbContext.User.FirstOrDefaultAsync(u => u.Username == DelegationAdd.User.Username);
            Admin existingAdmin = await _dbContext.Admin.FirstOrDefaultAsync(a => a.User.Username == DelegationAdd.Admin.User.Username);
            

            //Role acceptingRole = await _dbContext.Role.FirstOrDefaultAsync(r => r.Name == "MD");
            //User acceptingUser = await _dbContext.User.FirstOrDefaultAsync(ro => ro.Role_ID == acceptingRole.Role_ID);
            // Create Notification in notification table





            if (existingStatus != null)
            {
                DelegationAdd.Delegation_Status = existingStatus;
            }

            if(existingUser != null)
            {
                DelegationAdd.User = existingUser;
            }

            if(existingAdmin != null)
            {
                DelegationAdd.Admin = existingAdmin;
            }

            await _dbContext.Delegation_Of_Authority.AddAsync(DelegationAdd);
            await _dbContext.SaveChangesAsync();

            return new Delegation_Of_Authority[] { DelegationAdd };
        }

        public async Task<Delegation_Of_Authority> UpdateDelegationAsync(Delegation_Of_Authority DelegationUpdate, int delegationID)
        {
            var delegation = await _dbContext.Delegation_Of_Authority.FindAsync(delegationID);

            delegation.DelegatingParty = DelegationUpdate.DelegatingParty;
            delegation.Delegation_Document = DelegationUpdate.Delegation_Document;
            delegation.To_Date = DelegationUpdate.To_Date;
            delegation.From_Date = DelegationUpdate.From_Date;
            delegation.Admin_ID = DelegationUpdate.Admin_ID;
            delegation.DelegationStatus_ID = DelegationUpdate.DelegationStatus_ID;
            delegation.User_Id = DelegationUpdate.User_Id;

            delegation.Admin = new Admin();
            delegation.Delegation_Status = new Delegation_Status();
            delegation.User = new User();

            Delegation_Status existingStatus = await _dbContext.Delegation_Status.FirstOrDefaultAsync(s => s.Name == DelegationUpdate.Delegation_Status.Name);
            User existingUser = await _dbContext.User.FirstOrDefaultAsync(u => u.Username == DelegationUpdate.User.Username);
            Admin existingAdmin = await _dbContext.Admin.FirstOrDefaultAsync(a => a.User.Username == DelegationUpdate.Admin.User.Username);

            delegation.Admin = existingAdmin;
            delegation.Delegation_Status = existingStatus;
            delegation.User = existingUser;

            await _dbContext.SaveChangesAsync();

            return delegation;
        }

        public async Task<Delegation_Of_Authority> UpdateDelegationStatusAsync(int statusID, int delegationID)
        {
            var delegation = await GetDelegationAsync(delegationID);

            
            delegation.DelegationStatus_ID = statusID;


            delegation.Delegation_Status = new Delegation_Status();

            Delegation_Status existingStatus = await _dbContext.Delegation_Status.FirstOrDefaultAsync(s => s.Status_ID == statusID);

            delegation.Delegation_Status = existingStatus;

            await _dbContext.SaveChangesAsync();

            return delegation;
        }

        //public async Task<Delegation_Of_Authority> EditDelegationStatusAsync(int delegationID)
        //{
        //    var delegation = await GetDelegationAsync(delegationID);

        //    Delegation_Status existingStatus = await _dbContext.Delegation_Status.FirstOrDefaultAsync(s => s.Name == "Active");

        //    delegation.Delegation_Status = existingStatus;

        //    await _dbContext.SaveChangesAsync();

        //    return delegation;
        //}

        public async Task<Delegation_Of_Authority> GetDelegationAsync(int delegationID)
        {
            IQueryable<Delegation_Of_Authority> query = _dbContext.Delegation_Of_Authority
                .Include(s => s.Delegation_Status).Include(a => a.Admin).Include(u => u.User).ThenInclude(ur => ur.Role).Include(u => u.User).ThenInclude(ua => ua.Access)
                .Where(w => w.Delegation_ID == delegationID);

            return await query.FirstOrDefaultAsync();
        }

        public async Task<Delegation_Of_Authority> DeleteDelegationAsync(int delegationID)
        {
            var DelegationToDelete = await _dbContext.Delegation_Of_Authority.FirstOrDefaultAsync(x => x.Delegation_ID == delegationID);
            _dbContext.Delegation_Of_Authority.Remove(DelegationToDelete);
            await _dbContext.SaveChangesAsync();

            return DelegationToDelete;
        }

        public void Delete<T>(T entity) where T : class
        {
            _dbContext.Remove(entity);
        }

        public async Task<bool> SaveChangesAsync()
        {
            return await _dbContext.SaveChangesAsync() > 0;
        }

        public async Task<Delegation_Status[]> GetAllRejStatusesAsync()
        {
            IQueryable<Delegation_Status> query = _dbContext.Delegation_Status.Where(x => x.Name.Contains("Rejected"));

            return await query.ToArrayAsync();
        }



        public async Task<Delegation_Status[]> GetAllStatusesAsync()
        {
            IQueryable<Delegation_Status> query = _dbContext.Delegation_Status;

            return await query.ToArrayAsync();
        }

        public async Task<Delegation_Status> GetRevokeStatusAsync()
        {
            IQueryable<Delegation_Status> query = _dbContext.Delegation_Status.Where(x => x.Name == "Revoked");

            return await query.FirstOrDefaultAsync();
        }

        public async Task<Temporary_Access[]> AddTempAccAsync(Temporary_Access TempAccAdd)
        {
            Delegation_Of_Authority existingDelegation = await _dbContext.Delegation_Of_Authority.FirstOrDefaultAsync(doa => doa.Delegation_ID == TempAccAdd.Delegation_ID);



            if (existingDelegation != null)
            {
                TempAccAdd.Delegation_Of_Authority = existingDelegation;
            }

            await _dbContext.Temporary_Access.AddAsync(TempAccAdd);
            await _dbContext.SaveChangesAsync();

            return new Temporary_Access[] { TempAccAdd };
        }

        public async Task<Temporary_Access> GetTempAccAsync(int delegationID)
        {
            IQueryable<Temporary_Access> query = _dbContext.Temporary_Access
                .Include(d => d.Delegation_Of_Authority)
                .Where(w => w.Delegation_ID == delegationID);

            return await query.FirstOrDefaultAsync();
        }

        public async Task<Temporary_Access> GetLoginTempAccAsync(int delegationID)
        {
            IQueryable<Temporary_Access> query = _dbContext.Temporary_Access
                .Where(w => w.Delegation_ID == delegationID);

            return await query.FirstOrDefaultAsync();
        }

        public async Task<Temporary_Access> UpdateTempAccAsync(Temporary_Access UpdatedTempAcc, int tempAccID)
        {
            var tempacc = await _dbContext.Temporary_Access.FindAsync(tempAccID);

            tempacc.CanAccFin = UpdatedTempAcc.CanAccFin;
            tempacc.CanAccPro = UpdatedTempAcc.CanAccPro;
            tempacc.CanAccRep = UpdatedTempAcc.CanAccRep;
            tempacc.CanAccVen = UpdatedTempAcc.CanAccVen;
            tempacc.CanAccInv = UpdatedTempAcc.CanAccInv;
            tempacc.CanAppVen = UpdatedTempAcc.CanAppVen;
            tempacc.CanDeleteVen = UpdatedTempAcc.CanDeleteVen;
            tempacc.CanEditVen = UpdatedTempAcc.CanEditVen;
            tempacc.CanViewFinPro = UpdatedTempAcc.CanViewFinPro;
            tempacc.CanViewFlagPro = UpdatedTempAcc.CanViewFlagPro;
            tempacc.CanViewPenPro = UpdatedTempAcc.CanViewPenPro;
            
            await _dbContext.SaveChangesAsync();
            return tempacc;
        }

        public async Task<Notification[]> AddActiveNotificationaAsync(int userID, Notification newNotification, Delegation_Of_Authority delegation)
        {
            
            Notification_Type existingNotificationType = await _dbContext.Notification_Type.FirstOrDefaultAsync(x => x.Notification_Type_ID == 20);
            User existingUser = await _dbContext.User.FirstOrDefaultAsync(a => a.User_Id == userID);

            if (existingNotificationType != null)
            {
                newNotification.Notification_Type = existingNotificationType;
            }

            if (existingUser != null)
            {
                newNotification.User = existingUser;
                newNotification.User.No_Notifications = existingUser.No_Notifications + 1;
                newNotification.User.No_DelNotifications = existingUser.No_DelNotifications + 1;
            }

            newNotification.Send_Date = DateTime.Now;
            newNotification.Name = "Delegation of Authority for user " + delegation.DelegatingParty + " is active and valid until " + delegation.To_Date;

            await _dbContext.Notification.AddAsync(newNotification);
            await _dbContext.SaveChangesAsync();

            return new Notification[] { newNotification };
        }

        public async Task<Notification[]> AddRevokeNotificationaAsync(int userID, Notification newNotification, Delegation_Of_Authority delegation)
        {

            Notification_Type existingNotificationType = await _dbContext.Notification_Type.FirstOrDefaultAsync(x => x.Notification_Type_ID == 21);
            User existingUser = await _dbContext.User.FirstOrDefaultAsync(a => a.User_Id == userID);

            if (existingNotificationType != null)
            {
                newNotification.Notification_Type = existingNotificationType;
            }

            if (existingUser != null)
            {
                newNotification.User = existingUser;
                newNotification.User.No_Notifications = existingUser.No_Notifications + 1;
                newNotification.User.No_DelNotifications = existingUser.No_DelNotifications + 1;
            }

            newNotification.Send_Date = DateTime.Now;
            newNotification.Name = "Delegation of Authority for user " + delegation.DelegatingParty + " has been revoked.";

            await _dbContext.Notification.AddAsync(newNotification);
            await _dbContext.SaveChangesAsync();

            return new Notification[] { newNotification };
        }

        public async Task<Delegation_Of_Authority> CreateDelegationValidationAsync(string name)
        {
            Delegation_Of_Authority ExistingActiveDelegation = await _dbContext.Delegation_Of_Authority.FirstOrDefaultAsync(x => x.DelegatingParty == name && x.Delegation_Status.Name == "Active");
            Delegation_Of_Authority ExistingInactiveDelegation = await _dbContext.Delegation_Of_Authority.FirstOrDefaultAsync(x => x.DelegatingParty == name && x.Delegation_Status.Name == "Inactive");

            if (ExistingActiveDelegation != null)
            {
                return ExistingActiveDelegation;
            }
            else if (ExistingInactiveDelegation != null)
            {
                return ExistingInactiveDelegation;
            }
            else
            {
                return null;
            }
        }

        public async Task<Delegation_Of_Authority> EditDelegationValidationAsync(string name)
        {
            Delegation_Of_Authority ExistingActiveDelegation = await _dbContext.Delegation_Of_Authority.FirstOrDefaultAsync(x => x.DelegatingParty == name && x.Delegation_Status.Name == "Active");

            if (ExistingActiveDelegation != null)
            {
                return ExistingActiveDelegation;
            }
            
            else
            {
                return null;
            }
        }
    }
}
