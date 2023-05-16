using Microsoft.EntityFrameworkCore;
using ProcionAPI.Data;
using ProcionAPI.Models.Entities;
using ProcionAPI.ViewModel;

namespace ProcionAPI.Models.Repositories
{
    public class OnboardRequestRepository : IOnboardRequestRepository
    {
        private readonly AppDBContext _dbContext;

        public OnboardRequestRepository(AppDBContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<VendorOnboardRequestVM[]> GetAllOnBoardRequestAsync()
        {
            var result = await (from OR in _dbContext.Onboard_Request
                                join V in _dbContext.Vendor
                                on OR.Vendor_ID equals V.Vendor_ID
                                join U in _dbContext.User
                                on OR.User_Id equals U.User_Id
                                join E in _dbContext.Employee 
                                on U.User_Id equals E.User_Id
                                select new VendorOnboardRequestVM
                                { Onboard_Request_Id = OR.Onboard_Request_Id,
                                  Vendor_ID = V.Vendor_ID,
                                  EmployeeName = E.EmployeeName,
                                  Vendors = V,
                                  Quotes = OR.Quotes}).ToArrayAsync();
            
            return result;
        }

        public async Task<Onboard_Request[]> AddRequestAsync(Onboard_Request RequestAdd)
        {
            
            User existingUser = await _dbContext.User.FirstOrDefaultAsync(x => x.User_Id == RequestAdd.User_Id);

            if (existingUser != null)
            {
                RequestAdd.Users = existingUser;
            }
            
            Vendor_Status existingVendorStatus = await _dbContext.Vendor_Status.FirstOrDefaultAsync(x => x.Vendor_Status_ID == RequestAdd.Vendor.Vendor_Status_ID);

            if (existingVendorStatus != null)
            {
                RequestAdd.Vendor.Vendor_Status = existingVendorStatus;
            }
            Vendor existingVendor = await _dbContext.Vendor.FirstOrDefaultAsync(x => x.Vendor_ID == RequestAdd.Vendor_ID);

            if (existingVendor != null) 
            { 
                RequestAdd.Vendor = existingVendor;
            }

           

            await _dbContext.Onboard_Request.AddAsync(RequestAdd);
            await _dbContext.SaveChangesAsync();

            return new Onboard_Request[] { RequestAdd };
        }
        public async Task<Vendor[]> GetAllVendorRequestsAsync()
        {
            IQueryable<Vendor> query = _dbContext.Vendor;
            return await query.ToArrayAsync();
        }

        public async Task<Vendor> EditVendorAsync(int Vendor_ID, Vendor Request)
        {
            var existingVendor = await _dbContext.Vendor.FirstOrDefaultAsync(x => x.Name.ToLower().Trim() == Request.Name.ToLower().Trim());

            if (existingVendor != null)
            {
                existingVendor.Email= Request.Email;
                Request = existingVendor;
            }
            else
            {
                existingVendor = await _dbContext.Vendor.FindAsync(Vendor_ID);
                existingVendor.Name = Request.Name;
                existingVendor.Email= Request.Email;
            }            

            await _dbContext.SaveChangesAsync();

            return existingVendor;
        }

        public async Task<Onboard_Request[]> GetRequestsAsync(int RequestID)
        {
            IQueryable<Onboard_Request> query = _dbContext.Onboard_Request.Include(x => x.Vendor).Where(x => x.Onboard_Request_Id == RequestID);

            return await query.ToArrayAsync();
        }


        public async Task<Onboard_Request> EditRequestAsync(int RequestID, int VendorID, Onboard_Request UpdatedRequest)
        { //also see userid
            var ReqUpdt = await _dbContext.Onboard_Request.FirstOrDefaultAsync(x => x.Onboard_Request_Id == RequestID && x.Vendor_ID == VendorID);

            // var existingVendor = await _dbContext.Vendor.FirstOrDefaultAsync(x => x.Name.ToLower().Trim() == UpdatedRequest.Vendor.Name.ToLower().Trim());


            //await _dbContext.Onboard_Request.FirstOrDefaultAsync(x => x.Onboard_Request_Id == RequestID && x.Vendor_ID == UpdatedRequest.Vendor_ID);



            ReqUpdt.Users = new User();

            User existingUser = await _dbContext.User.FirstOrDefaultAsync(x => x.User_Id == UpdatedRequest.User_Id);

            ReqUpdt.Users = existingUser;

            ReqUpdt.Vendor = new Vendor();

            Vendor existingVendor = await _dbContext.Vendor.FirstOrDefaultAsync(x => x.Name.ToLower().Trim() == UpdatedRequest.Vendor.Name.ToLower().Trim());

            if (existingVendor != null)
            {
                existingVendor.Email = UpdatedRequest.Vendor.Email;
                ReqUpdt.Vendor = existingVendor;
            }
            else
            {
                existingVendor = await _dbContext.Vendor.FindAsync(VendorID);
              
                    existingVendor.Name = UpdatedRequest.Vendor.Name;
                    existingVendor.Email = UpdatedRequest.Vendor.Email;
                     ReqUpdt.Vendor = existingVendor;
               
               
            }

            var existingVendorStatus = await _dbContext.Vendor_Status.FindAsync(UpdatedRequest.Vendor.Vendor_Status_ID);


            ReqUpdt.Vendor.Vendor_Status = existingVendorStatus;

            ReqUpdt.Quotes = UpdatedRequest.Quotes;

            await _dbContext.SaveChangesAsync();

            return ReqUpdt;
        }


        public async Task<Onboard_Request> DeleteRequestAsync(int RequestId,int VendorID)
        {
            var RequestToDelete = await _dbContext.Onboard_Request.FirstOrDefaultAsync(x => x.Onboard_Request_Id == RequestId && x.Vendor_ID == VendorID);
            _dbContext.Onboard_Request.Remove(RequestToDelete);
            await _dbContext.SaveChangesAsync();

            return RequestToDelete;
        }

    }
   
}
