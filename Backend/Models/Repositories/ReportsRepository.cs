using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using ProcionAPI.Data;
using ProcionAPI.Models.Entities;
using ProcionAPI.Controllers;
using ProcionAPI.ViewModel;

namespace ProcionAPI.Models.Repositories
{
    public class ReportsRepository : IReportsRepository
    {
        private readonly AppDBContext _dbContext;

        public ReportsRepository(AppDBContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<BEESpentReportVM[]> getBEESpendReportAsync(DateTime StartDate, DateTime EndDate)
        {




            var ProcurementRequestDetails = await _dbContext.Procurement_Details
            .Include(PC => PC.Procurement_Request)
            .ThenInclude(V => V.Vendor)
            .Include(E => E.Employee)
            .ThenInclude(B => B.Department)
            .Include(BL => BL.Budget_Line)
            .ThenInclude(BC => BC.Budget_Category)
            .Where(P => (P.Procurement_Status_ID == 2) && (P.Full_Payment_Due_Date >= StartDate) && (P.Full_Payment_Due_Date <= EndDate) )
            .ToListAsync();
            
            var VendorIDs = ProcurementRequestDetails.Select(V => V.Procurement_Request.Vendor_ID).ToList();



            var VendorBEEDetails = VendorIDs.Select(GetBEELevel);
            var VendorBEELevel = await Task.WhenAll(VendorBEEDetails);

            var query = ProcurementRequestDetails.Select((R, index) => new BEESpentReportVM
            {
                BranchName = R.Employee.Department.Name,
                TotalSpend = R.Total_Amount,
                BEE_Level = VendorBEELevel[index],
            });

            return query.ToArray();

        }

        private async Task<int> GetBEELevel(int VendorID)
        {
            var VendorBEE = _dbContext.Vendor_BEE.FirstOrDefault(V => V.Vendor_ID == VendorID);
            if (VendorBEE != null)
            {
                return VendorBEE.BEE_Level;
            }
            else
            {
                return 0;
            }
        }


        public async Task<VendorSpentReport[]> getVendorSpentReportAsync()
        {




            var ProcurementRequestDetails = await _dbContext.Procurement_Details
            .Include(PC => PC.Procurement_Request)
            .ThenInclude(V => V.Vendor)
            .Include(E => E.Employee)
            .ThenInclude(B => B.Department)
            .Include(BL => BL.Budget_Line)
            .ThenInclude(BC => BC.Budget_Category)
            .Include(BL => BL.Budget_Line)
            .ThenInclude(BA => BA.Budget_Allocation)
            .Where(P => P.Procurement_Status_ID == 2)
            .ToListAsync();

            var VendorIDs = ProcurementRequestDetails.Select(V => V.Procurement_Request.Vendor_ID).ToList();



            var VendorBEEDetails = VendorIDs.Select(GetBEELevel);
            var VendorBEELevel = await Task.WhenAll(VendorBEEDetails);

            var query = ProcurementRequestDetails.Select((R, index) => new VendorSpentReport
            {
                SupplierName = R.Procurement_Request.Vendor.Name,
                AccountCode = R.Account_Code,
                AccountName = R.Budget_Line.Budget_Category.Account_Name,
                BudgetDepartment = R.Budget_Line.Budget_Category.Account_Name,
                DepartmentName = R.Employee.Department.Name,
                BEE_Level = VendorBEELevel[index],
                TotalSpend = R.Total_Amount,
            });

            return query.ToArray();

        }


    }
}
