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
            IQueryable<Procurement_Request> query = _dbContext.Procurement_Request.Include(r => r.Requisition_Status).Include(u => u.User).Include(v => v.Vendor).ThenInclude(s => s.Vendor_Status); ;
            return await query.ToArrayAsync();
        }
        public async Task<Procurement_Request[]> AddProcurementRequestAsync(Procurement_Request RequestAdd)
        {
            //Get User
            User ExistingUser = await _dbContext.User.FirstOrDefaultAsync(u => u.Username == RequestAdd.User.Username);
            //Get User Role
            Role ExistingRole = await _dbContext.Role.FirstOrDefaultAsync(r => r.Role_ID == ExistingUser.Role_ID);
            Console.WriteLine("Success 1");
            //GetVendor
            Vendor ExistingVendor = await _dbContext.Vendor.FirstOrDefaultAsync(v => v.Name.ToLower() == RequestAdd.Vendor.Name.ToLower());
            Console.WriteLine("Success 2");
            //GetRequisition Status
            Requisition_Status ExistingStatus = await _dbContext.Requisition_Status.FirstOrDefaultAsync(c => c.Name == RequestAdd.Requisition_Status.Name);

            if (ExistingUser != null && ExistingVendor != null && ExistingStatus != null)
            {
                //GetVendor Status
                Vendor_Status ExistingVendorStatus = await _dbContext.Vendor_Status.FirstOrDefaultAsync(vs => vs.Vendor_Status_ID == ExistingVendor.Vendor_Status_ID);
                RequestAdd.User = ExistingUser;
                RequestAdd.User.Role = ExistingRole;
                RequestAdd.Vendor = ExistingVendor;
                RequestAdd.Vendor.Vendor_Status = ExistingVendorStatus;
                RequestAdd.Requisition_Status = ExistingStatus;
                RequestAdd.Vendor.Number_Of_Times_Used = ExistingVendor.Number_Of_Times_Used + 1;

                if (RequestAdd.Vendor.Vendor_Status.Name == "Other" && RequestAdd.Vendor.Number_Of_Times_Used >= 3)
                {
                    return null;
                }

                else
                {
                    await _dbContext.Procurement_Request.AddAsync(RequestAdd);
                    await _dbContext.SaveChangesAsync();

                    return new Procurement_Request[] { RequestAdd };
                }
            }

           else if (ExistingVendor == null)
            {
                Console.WriteLine(ExistingVendor == null);
                Vendor_Status Otherstatus = await _dbContext.Vendor_Status.FirstOrDefaultAsync(i => i.Vendor_Status_ID == 6);
                Vendor NewOtherVendor = new Vendor() { 
                    Vendor_ID = 0,
                    Vendor_Status_ID = 6,
                    Vendor_Status = Otherstatus,
                    Name = RequestAdd.Vendor.Name,
                    Email = RequestAdd.Vendor.Email,
                    Number_Of_Times_Used = 1,
                    Sole_Supplier_Provided = false,
                    PreferedVendor = true

                };
                await _dbContext.Vendor.AddAsync(NewOtherVendor);
                Console.WriteLine("Vendor Add Success");

                RequestAdd.User = ExistingUser;
                RequestAdd.User.Role = ExistingRole;
                RequestAdd.Vendor = NewOtherVendor;
                RequestAdd.Vendor.Vendor_Status = Otherstatus;
                RequestAdd.Requisition_Status = ExistingStatus;

                await _dbContext.Procurement_Request.AddAsync(RequestAdd);
                Console.WriteLine("Request Success");
                await _dbContext.SaveChangesAsync();

                return new Procurement_Request[] { RequestAdd };

            }

            return null;
            

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
        public async Task<Procurement_Request_Quote[]> GetProcurementQuotesAsync()
        {
            IQueryable<Procurement_Request_Quote> query = _dbContext.Procurement_Request_Quote.Include(r => r.Procurement_Request).ThenInclude(v => v.Vendor).ThenInclude(s => s.Vendor_Status);
            return await query.ToArrayAsync();
        }
        public async Task<Procurement_Request_Quote[]> GetProcurementQuotesbyIDAsync(int id)
        {
            IQueryable<Procurement_Request_Quote> query = _dbContext.Procurement_Request_Quote.Where(x => x.Procurement_Request_ID == id);
            return await query.ToArrayAsync();
        }

        

        public async Task<Procurement_Request> DeleteProcurementRequestAsync(int id)
        {
            var hasDetails = await _dbContext.Procurement_Details.FirstOrDefaultAsync(x => x.Procurement_Request_ID == id);
            var hasQuotes = await _dbContext.Procurement_Request_Quote.FirstOrDefaultAsync(x => x.Procurement_Request_ID == id);
            var VendorDetails = await _dbContext.Procurement_Request.Include(v => v.Vendor).FirstOrDefaultAsync(i => i.Procurement_Request_ID == id);
            VendorDetails.Vendor.Number_Of_Times_Used = VendorDetails.Vendor.Number_Of_Times_Used - 1;

            if (hasDetails != null || hasQuotes != null)
            {
                var detailsRemove = _dbContext.Procurement_Details.Where(x => x.Procurement_Request_ID == id);
                _dbContext.Procurement_Details.RemoveRange(detailsRemove);

                var quotesRemove = _dbContext.Procurement_Request_Quote.Where(x => x.Procurement_Request_ID == id);

                _dbContext.Procurement_Request_Quote.RemoveRange(quotesRemove);
            }
            var RequestToDelete = await _dbContext.Procurement_Request.FindAsync(id);
            RequestToDelete.Vendor.Number_Of_Times_Used  = RequestToDelete.Vendor.Number_Of_Times_Used - 1;
            _dbContext.Procurement_Request.Remove(RequestToDelete);
            await _dbContext.SaveChangesAsync();

            return RequestToDelete;
        }

        public async Task<Procurement_Request> GetRequestByIDAsync(int id)
        {
            Procurement_Request ChosenRequest = await _dbContext.Procurement_Request.Include(u => u.User).ThenInclude(r => r.Role).Include(v => v.Vendor).ThenInclude(s => s.Vendor_Status).Include(r => r.Requisition_Status).FirstOrDefaultAsync(i => i.Procurement_Request_ID == id);
            return ChosenRequest;
        }

        public async Task<Procurement_Request> UpdateProcurementRequestAsync(int id, Procurement_Request Request)
        {
            var PRRequest = await _dbContext.Procurement_Request.FindAsync(id);

            PRRequest.Name = Request.Name;
            PRRequest.Description = Request.Description;

            await _dbContext.SaveChangesAsync();

            return PRRequest;
        }
        public async Task<Procurement_Request_Quote> UpdateProcurementRequestQuouteAsync(int id, Procurement_Request_Quote Request)
        {
            var PRRequest = await _dbContext.Procurement_Request_Quote.FindAsync(id);

            PRRequest.Path = Request.Path;
            PRRequest.Upload_Date = Request.Upload_Date;
            PRRequest.PrefferedQuote = Request.PrefferedQuote;

            await _dbContext.SaveChangesAsync();

            return PRRequest;
        }
    }
}
