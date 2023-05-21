using Azure.Core;
using Microsoft.EntityFrameworkCore;
using ProcionAPI.Data;
using ProcionAPI.Models.Entities;
using ProcionAPI.ViewModel;
using System.Linq.Expressions;

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
                                  Onboard_Request_status_ID = OR.Status_ID,
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

            Vendor existingVendor = await _dbContext.Vendor.FirstOrDefaultAsync(x => x.Name.ToLower().Trim() == RequestAdd.Vendor.Name.ToLower().Trim());

            if (existingVendor != null)
            {
                existingVendor.Name = RequestAdd.Vendor.Name;
                existingVendor.Email = RequestAdd.Vendor.Email;
                RequestAdd.Vendor = existingVendor;
            }
            else
            {
                existingVendor = await _dbContext.Vendor.FirstOrDefaultAsync(x => x.Vendor_ID == RequestAdd.Vendor_ID);


                if (existingVendor != null)
                {
                    existingVendor.Name = RequestAdd.Vendor.Name;
                    existingVendor.Email = RequestAdd.Vendor.Email;
                    RequestAdd.Vendor = existingVendor;
                }

            }


            //Vendor existingVendor = await _dbContext.Vendor.FirstOrDefaultAsync(x => x.Vendor_ID == RequestAdd.Vendor_ID);

            //if (existingVendor != null) 
            //{ 
            //    RequestAdd.Vendor = existingVendor;
            //}

            Onboard_Status existingOnboardStatus = await _dbContext.Onboard_Status.FirstOrDefaultAsync(x => x.Status_ID == RequestAdd.Status_ID);

            if (existingOnboardStatus != null)
            {
                RequestAdd.Onboard_Status = existingOnboardStatus;
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

        public async Task<Vendor> GetVendorValidationAsync(string sVendorName)
        {
            var existingVendor = await _dbContext.Vendor.FirstOrDefaultAsync(x => x.Name.ToLower().Trim() == sVendorName.ToLower().Trim());

            if (existingVendor != null)
            {
               if(existingVendor.Vendor_Status_ID == 2)
                {
                    return existingVendor;
                }
               else
                {
                    return null;
                }
            }
            else
            {
                return null;
            
            }            
        }

        public async Task<Onboard_Request[]> GetRequestsAsync(int RequestID)
        {
            IQueryable<Onboard_Request> query = _dbContext.Onboard_Request.Include(x => x.Vendor).ThenInclude(x => x.Vendor_Status).Include(x => x.Users).ThenInclude(x => x.Role).Include(x => x.Onboard_Status).Where(x => x.Onboard_Request_Id == RequestID);

            return await query.ToArrayAsync();
        }

        //, int VendorID
        public async Task<Onboard_Request> EditRequestAsync(int RequestID, Onboard_Request UpdatedRequest)
        { //also see userid
            var ReqUpdt = await _dbContext.Onboard_Request.FirstOrDefaultAsync(x => (x.Onboard_Request_Id == RequestID) && (x.Vendor_ID == UpdatedRequest.Vendor.Vendor_ID));

            // var existingVendor = await _dbContext.Vendor.FirstOrDefaultAsync(x => x.Name.ToLower().Trim() == UpdatedRequest.Vendor.Name.ToLower().Trim());


          //  ReqUpdt.Users.Role = new Role();

           // Role existingRole = await _dbContext.Role.FirstOrDefaultAsync(x => x.Role_ID == UpdatedRequest.Users.Role_ID);
         
            //   ReqUpdt.Users.Role = existingRole;


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
                existingVendor = await _dbContext.Vendor.FindAsync(UpdatedRequest.Vendor.Vendor_ID);
              
                    existingVendor.Name = UpdatedRequest.Vendor.Name;
                    existingVendor.Email = UpdatedRequest.Vendor.Email;
                     ReqUpdt.Vendor = existingVendor;
               
               
            }

            var existingVendorStatus = await _dbContext.Vendor_Status.FindAsync(UpdatedRequest.Vendor.Vendor_Status_ID);


            ReqUpdt.Vendor.Vendor_Status = existingVendorStatus;

            ReqUpdt.Quotes = UpdatedRequest.Quotes;

            await _dbContext.SaveChangesAsync();

            return  ReqUpdt;
        }


        public async Task<Onboard_Request> DeleteRequestAsync(int RequestId,int VendorID)
        {
            var RequestToDelete = await _dbContext.Onboard_Request.FirstOrDefaultAsync(x => x.Onboard_Request_Id == RequestId && x.Vendor_ID == VendorID);
            _dbContext.Onboard_Request.Remove(RequestToDelete);
            await _dbContext.SaveChangesAsync();

            return RequestToDelete;
        }


        public async Task<Sole_Supplier[]> AddSoleSupplierDetailsAsync(int VendorID, Sole_Supplier soleSupplier)
        {

           
            Vendor existingVendor = await _dbContext.Vendor.FirstOrDefaultAsync(x => x.Vendor_ID == VendorID);

            if (existingVendor != null)
            {
                soleSupplier.Vendor = existingVendor;
            }

            Vendor_Status existingOnboardStatus = await _dbContext.Vendor_Status.FirstOrDefaultAsync(x => x.Vendor_Status_ID == soleSupplier.Vendor.Vendor_Status_ID);

            if (existingOnboardStatus != null)
            {
                soleSupplier.Vendor.Vendor_Status = existingOnboardStatus;
            }

            await _dbContext.Sole_Supplier.AddAsync(soleSupplier);
            await _dbContext.SaveChangesAsync();

            return new Sole_Supplier[] { soleSupplier };
        }

        public async Task<Sole_Supplier> GetSoleSupplierByIDAsync(int VendorID)
        {
            IQueryable<Sole_Supplier> query = _dbContext.Sole_Supplier.Include(x => x.Vendor).ThenInclude(x=>x.Vendor_Status).Where(x => x.Vendor_ID == VendorID);

            return await query.FirstOrDefaultAsync();
        }

        public async Task<Sole_Supplier> UpdateSoleSupplierAsync(int SoleSupplierID, Sole_Supplier UpdatedSoleSupplier)
        { //also see userid
            var SoleSupplierRequest = await _dbContext.Sole_Supplier.FirstOrDefaultAsync(x => x.Vendor_ID == SoleSupplierID);
          
            SoleSupplierRequest.MD_Approval = UpdatedSoleSupplier.MD_Approval;
            SoleSupplierRequest.Vendor = UpdatedSoleSupplier.Vendor;
            SoleSupplierRequest.Vendor_ID = UpdatedSoleSupplier.Vendor_ID;
            SoleSupplierRequest.Date = UpdatedSoleSupplier.Date;
            SoleSupplierRequest.Reason = UpdatedSoleSupplier.Reason;    


                SoleSupplierRequest.Vendor = new Vendor();

                Vendor existingVendor = await _dbContext.Vendor.FirstOrDefaultAsync(x => x.Vendor_ID == UpdatedSoleSupplier.Vendor_ID);

                if (existingVendor != null)
                {
                    SoleSupplierRequest.Vendor = existingVendor;
                }

                var existingVendorStatus = await _dbContext.Vendor_Status.FindAsync(UpdatedSoleSupplier.Vendor.Vendor_Status_ID);


                SoleSupplierRequest.Vendor.Vendor_Status = existingVendorStatus;

                SoleSupplierRequest.Reason = UpdatedSoleSupplier.Reason;

                await _dbContext.SaveChangesAsync();

                return SoleSupplierRequest;
           
        }


    }
   
}
