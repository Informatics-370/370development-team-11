using Microsoft.EntityFrameworkCore;
using ProcionAPI.Data;
using ProcionAPI.Models.Entities;

namespace ProcionAPI.Models.Repositories.Procurement_Requests
{
    public class ProcurementDetailsRepository : IProcurementDetailsRepository
    {
        private readonly AppDBContext _dbContext;

        public ProcurementDetailsRepository(AppDBContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<Procurement_Request> GetProcurementRequestByIDAsync(int ProcurementRequestID)
        {
            IQueryable<Procurement_Request> query = _dbContext.Procurement_Request.Include(x => x.Vendor).ThenInclude(x => x.Vendor_Status).Include(x => x.User).ThenInclude(x=> x.Role).Include(x => x.Requisition_Status).Where(x=> x.Procurement_Request_ID == ProcurementRequestID);

            return await query.FirstOrDefaultAsync();
        }

        public async Task<Procurement_Details[]> CreateProcurementDetailsAsync(Procurement_Details ProcurementDetails)
        {
            Employee existingEmployee = await _dbContext.Employee.FirstOrDefaultAsync(x => x.EmployeeID == ProcurementDetails.EmployeeID);

            if (existingEmployee != null)
            {
                ProcurementDetails.Employee = existingEmployee;
            }

            Procurement_Request existingProcurementRequest = await _dbContext.Procurement_Request.FirstOrDefaultAsync(x => x.Procurement_Request_ID == ProcurementDetails.Procurement_Request_ID);

            if (existingProcurementRequest != null)
            {
                ProcurementDetails.Procurement_Request = existingProcurementRequest;

               
            }

            //Vendor_Status existingVendorStatus = await _dbContext.Vendor_Status.FirstOrDefaultAsync(x => x.Vendor_Status_ID == ProcurementDetails.Procurement_Request.Vendor.Vendor_Status_ID);

            //if (existingVendorStatus != null)
            //{
            //    ProcurementDetails.Procurement_Request.Vendor.Vendor_Status = existingVendorStatus;
            //}

            //Role existingRole = await _dbContext.Role.FirstOrDefaultAsync(x => x.Role_ID == ProcurementDetails.Procurement_Request.User.Role_ID);

            //if (existingRole != null)
            //{
            //    ProcurementDetails.Procurement_Request.User.Role = existingRole;
            //}

            Sign_Off_Status existingSignOffStatus = await _dbContext.Sign_Off_Status.FirstOrDefaultAsync(x => x.Sign_Off_Status_ID == ProcurementDetails.Sign_Off_Status_ID);

            if (existingSignOffStatus != null)
            {
                ProcurementDetails.Sign_Off_Status = existingSignOffStatus;
            }

            Procurement_Payment_Status existingProcurementPaymentStatus = await _dbContext.Procurement_Payment_Status.FirstOrDefaultAsync(x => x.Procurement_Payment_Status_ID == ProcurementDetails.Procurement_Payment_Status_ID);

            if (existingProcurementPaymentStatus != null)
            {
                ProcurementDetails.Procurement_Payment_Status = existingProcurementPaymentStatus;
            }

            Budget_Line existingBudgetLine = await _dbContext.Budget_Line.FirstOrDefaultAsync(x => x.Account_Code == ProcurementDetails.Account_Code);

            if (existingBudgetLine != null)
            {
                ProcurementDetails.Budget_Line = existingBudgetLine;
            }

            Procurement_Status existingProcurementStatus = await _dbContext.Procurement_Status.FirstOrDefaultAsync(x => x.Procurement_Status_ID == ProcurementDetails.Procurement_Status_ID);

            if (existingProcurementStatus != null)
            {
                ProcurementDetails.Procurement_Status = existingProcurementStatus;
            }

            Payment_Method existingPaymentMethod = await _dbContext.Payment_Method.FirstOrDefaultAsync(x => x.Payment_Method_ID == ProcurementDetails.Payment_Method_ID);

            if (existingPaymentMethod != null)
            {
                ProcurementDetails.Payment_Method = existingPaymentMethod;
            }

            await _dbContext.Procurement_Details.AddAsync(ProcurementDetails);
            await _dbContext.SaveChangesAsync();

            return new Procurement_Details[] { ProcurementDetails };
        }
    }
}
