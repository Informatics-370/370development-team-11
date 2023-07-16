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

        public async Task<Delegation_Of_Authority[]> AddDelegationAsync(Delegation_Of_Authority DelegationAdd)
        {
            Delegation_Status existingStatus = await _dbContext.Delegation_Status.FirstOrDefaultAsync(s => s.Status_ID == DelegationAdd.DelegationStatus_ID);
            User existingUser = await _dbContext.User.FirstOrDefaultAsync(u => u.User_Id == DelegationAdd.User_Id);
            Admin existingAdmin = await _dbContext.Admin.FirstOrDefaultAsync(a => a.Admin_ID == DelegationAdd.Admin_ID);

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

            Admin existingAdmin = await _dbContext.Admin.FirstOrDefaultAsync(a => a.Admin_ID == DelegationUpdate.Admin_ID);
            Delegation_Status existingStatus = await _dbContext.Delegation_Status.FirstOrDefaultAsync(s => s.Status_ID == DelegationUpdate.DelegationStatus_ID);
            User existingUser = await _dbContext.User.FirstOrDefaultAsync(u => u.User_Id == DelegationUpdate.User_Id);

            delegation.Admin = existingAdmin;
            delegation.Delegation_Status = existingStatus;
            delegation.User = existingUser;

            await _dbContext.SaveChangesAsync();

            return delegation;
        }

        public async Task<Delegation_Of_Authority> UpdateDelegationStatusAsync(int statusID, int delegationID)
        {
            var delegation = await _dbContext.Delegation_Of_Authority.FindAsync(delegationID);

            
            delegation.DelegationStatus_ID = statusID;


            delegation.Delegation_Status = new Delegation_Status();

            Delegation_Status existingStatus = await _dbContext.Delegation_Status.FirstOrDefaultAsync(s => s.Status_ID == statusID);

            delegation.Delegation_Status = existingStatus;

            await _dbContext.SaveChangesAsync();

            return delegation;
        }

        public async Task<Delegation_Of_Authority> GetDelegationAsync(int delegationID)
        {
            IQueryable<Delegation_Of_Authority> query = _dbContext.Delegation_Of_Authority
                .Include(u => u.User).Include(s => s.Delegation_Status).Include(a => a.Admin)
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

        public async Task<Delegation_Status[]> GetAllStatusesAsync()
        {
            IQueryable<Delegation_Status> query = _dbContext.Delegation_Status.Where(x => x.Name.Contains("Rejected"));

            return await query.ToArrayAsync();
        }
    }
}
