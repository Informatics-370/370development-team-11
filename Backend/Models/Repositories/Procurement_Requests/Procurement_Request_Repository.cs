using Microsoft.EntityFrameworkCore;
using ProcionAPI.Data;
using ProcionAPI.Models.Entities;

namespace ProcionAPI.Models.Repositories.Procurement_Requests
{
    public class Procurement_Request_Repository: IProcurement_Request_Repository
    {
        private readonly AppDBContext _dbContext;

        public Procurement_Request_Repository(AppDBContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<Procurement_Request[]> GetProcurementRequestsAsync()
        {
            IQueryable<Procurement_Request> query = _dbContext.Procurement_Request.Include(r => r.Requisition_Status).Include(u => u.User).Include(v => v.Vendor);
            return await query.ToArrayAsync();
        }
        public async Task<Procurement_Request[]> AddProcurementRequestAsync(Procurement_Request RequestAdd)
        {
            //Get User
            User ExistingUser = await _dbContext.User.FirstOrDefaultAsync(u => u.Username == RequestAdd.User.Username);
            //Get User Role
            Role ExistingRole = await _dbContext.Role.FirstOrDefaultAsync(r => r.Role_ID == ExistingUser.Role_ID);
            //GetVendor
            Vendor ExistingVendor = await _dbContext.Vendor.FirstOrDefaultAsync(v => v.Name == RequestAdd.Vendor.Name);
            //GetVendor Status
            Vendor_Status ExistingVendorStatus = await _dbContext.Vendor_Status.FirstOrDefaultAsync(vs => vs.Vendor_Status_ID == ExistingVendor.Vendor_Status_ID);
            //GetRequisition Status
            Requisition_Status ExistingStatus = await _dbContext.Requisition_Status.FirstOrDefaultAsync(c => c.Name == RequestAdd.Requisition_Status.Name);

            if (ExistingUser != null && ExistingVendor != null && ExistingStatus != null)
            {
                // Category already exists, assign its ID to the new consumable
                RequestAdd.User = ExistingUser;
                RequestAdd.User.Role = ExistingRole;
                RequestAdd.Vendor = ExistingVendor;
                RequestAdd.Vendor.Vendor_Status = ExistingVendorStatus;
                RequestAdd.Requisition_Status = ExistingStatus;
            }

            // Add the dummy data to the database and save changes
            await _dbContext.Procurement_Request.AddAsync(RequestAdd);
            await _dbContext.SaveChangesAsync();

            return new Procurement_Request[] { RequestAdd };
        }

        public async Task<Procurement_Request_Quote[]> CreateProcurementQuoteAsync(Procurement_Request_Quote RequestAdd)
        {
            //Get Procurement Request
            Procurement_Request ExistingPRRequest = await _dbContext.Procurement_Request.FirstOrDefaultAsync(PR => PR.Name == RequestAdd.Procurement_Request.Name);


            if (ExistingPRRequest != null)
            {
                // Category already exists, assign its ID to the new consumable
                RequestAdd.Procurement_Request = ExistingPRRequest;
            }

            // Add the dummy data to the database and save changes
            await _dbContext.Procurement_Request_Quote.AddAsync(RequestAdd);
            await _dbContext.SaveChangesAsync();

            return new Procurement_Request_Quote[] { RequestAdd };
        }
    }
}
