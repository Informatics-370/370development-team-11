using DocumentFormat.OpenXml.Spreadsheet;
using Microsoft.CodeAnalysis.VisualBasic.Syntax;
using Microsoft.EntityFrameworkCore;
using Org.BouncyCastle.Crypto.Agreement;
using ProcionAPI.Data;
using ProcionAPI.Models.Entities;
using System.Globalization;

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
            IQueryable<Procurement_Request> query = _dbContext.Procurement_Request.Include(x => x.Vendor).ThenInclude(x => x.Vendor_Status).Include(x => x.User).ThenInclude(x => x.Role).Include(x => x.User).ThenInclude(x => x.Access).Include(x => x.Requisition_Status).Where(x => x.Procurement_Request_ID == ProcurementRequestID);

            return await query.FirstOrDefaultAsync();
        }

        public async Task<Procurement_Request_Quote[]> GetProcurementRequestQuoteByIDAsync(int ProcurementRequestID)
        {
            IQueryable<Procurement_Request_Quote> query = _dbContext.Procurement_Request_Quote.Include(x => x.Procurement_Request).ThenInclude(x => x.Requisition_Status).Where(x => x.Procurement_Request_ID == ProcurementRequestID);

            return await query.ToArrayAsync();
        }

        public async Task<Procurement_Details[]> CreateProcurementDetailsAsync(Procurement_Details ProcurementDetails)
        {
            Employee existingEmployee = await _dbContext.Employee.Include(x => x.User).ThenInclude(x => x.Role).FirstOrDefaultAsync(x => x.EmployeeID == ProcurementDetails.EmployeeID);

            if (existingEmployee != null)
            {
                ProcurementDetails.Employee = existingEmployee;
            }

            Procurement_Request existingProcurementRequest = await _dbContext.Procurement_Request.Include(x => x.User).Include(x => x.Requisition_Status).Include(x => x.Vendor).ThenInclude(x => x.Vendor_Status).FirstOrDefaultAsync(x => x.Procurement_Request_ID == ProcurementDetails.Procurement_Request_ID);

            if (existingProcurementRequest != null)
            {
                ProcurementDetails.Procurement_Request = existingProcurementRequest;


            }

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

            Budget_Line existingBudgetLine = await _dbContext.Budget_Line.Include(x => x.Budget_Category).Include(x => x.Budget_Allocation).ThenInclude(x=> x.Department).FirstOrDefaultAsync(x => x.BudgetLineId == ProcurementDetails.BudgetLineId);

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

        public async Task<Deposit[]> AddDepositAsync(Deposit DepositDetails)
        {


            Procurement_Details existingProcurementDetails = await _dbContext.Procurement_Details.FirstOrDefaultAsync(x => x.Procurement_Details_ID == DepositDetails.Procurement_Details_ID);

            if (existingProcurementDetails != null)
            {
                DepositDetails.Procurement_Details = existingProcurementDetails;
            }



            await _dbContext.Deposit.AddAsync(DepositDetails);
            await _dbContext.SaveChangesAsync();

            return new Deposit[] { DepositDetails };
        }

        public async Task<Payment_Made[]> AddPaymentMadeAsync(Payment_Made PaymentMadeDetails)
        {


            Procurement_Details existingProcurementDetails = await _dbContext.Procurement_Details.FirstOrDefaultAsync(x => x.Procurement_Details_ID == PaymentMadeDetails.Procurement_Details_ID);

            if (existingProcurementDetails != null)
            {
                PaymentMadeDetails.Procurement_Details = existingProcurementDetails;
            }



            await _dbContext.Payment_Made.AddAsync(PaymentMadeDetails);
            await _dbContext.SaveChangesAsync();

            return new Payment_Made[] { PaymentMadeDetails };
        }

        public async Task<Proof_Of_Payment[]> AddProofOfPaymentAsync(Proof_Of_Payment AddPOP)
        {


            Procurement_Details existingProcurementDetails = await _dbContext.Procurement_Details.FirstOrDefaultAsync(x => x.Procurement_Details_ID == AddPOP.Procurement_Details_ID);

            if (existingProcurementDetails != null)
            {
                if (existingProcurementDetails.Payment_Made == false)
                {
                    existingProcurementDetails.Payment_Made = true;
                    await _dbContext.SaveChangesAsync();
                    AddPOP.Procurement_Details = existingProcurementDetails;
                }
                
            }



            await _dbContext.Proof_Of_Payment.AddAsync(AddPOP);
            await _dbContext.SaveChangesAsync();

            return new Proof_Of_Payment[] { AddPOP };
        }

        public async Task<Procurement_Invoice[]> AddInvoiceAsync(Procurement_Invoice AddINV)
        {


            Procurement_Details existingProcurementDetails = await _dbContext.Procurement_Details.FirstOrDefaultAsync(x => x.Procurement_Details_ID == AddINV.Procurement_Details_ID);

            if (existingProcurementDetails != null)
            {
                AddINV.Procurement_Details = existingProcurementDetails;
            }



            await _dbContext.Procurement_Invoice.AddAsync(AddINV);
            await _dbContext.SaveChangesAsync();

            return new Procurement_Invoice[] { AddINV };
        }

        public async Task<Procurement_Consumable[]> AddProcurementConsumableAsync(Procurement_Consumable AddProcurementConsumable)
        {


            Procurement_Details existingProcurementDetails = await _dbContext.Procurement_Details.Include(x => x.Employee).ThenInclude(x => x.User).ThenInclude(x => x.Role).FirstOrDefaultAsync(x => x.Procurement_Details_ID == AddProcurementConsumable.Procurement_Details_ID);
            Console.WriteLine(existingProcurementDetails);
            if (existingProcurementDetails != null)
            {
                AddProcurementConsumable.Procurement_Details = existingProcurementDetails;
            }

            Consumable existingConsumable = await _dbContext.Consumable.FirstOrDefaultAsync(x => x.Consumable_ID == AddProcurementConsumable.Consumable_ID);

            if (existingConsumable != null)
            {
                AddProcurementConsumable.Consumable = existingConsumable;
            }


            await _dbContext.Procurement_Consumable.AddAsync(AddProcurementConsumable);
            await _dbContext.SaveChangesAsync();

            return new Procurement_Consumable[] { AddProcurementConsumable };
        }

        public async Task<Vendor_Consumable[]> AddVendorConsumableAsync(Vendor_Consumable AddVendorConsumable)
        {


            Vendor existingVendor = await _dbContext.Vendor.FirstOrDefaultAsync(x => x.Vendor_ID == AddVendorConsumable.Vendor_ID);

            if (existingVendor != null)
            {
                AddVendorConsumable.Vendor = existingVendor;
            }

            Consumable existingConsumable = await _dbContext.Consumable.FirstOrDefaultAsync(x => x.Consumable_ID == AddVendorConsumable.Consumable_ID);

            if (existingConsumable != null)
            {
                AddVendorConsumable.Consumable = existingConsumable;
            }

            Consumable_Category existingConsumableCategorye = await _dbContext.Consumable_Category.FirstOrDefaultAsync(x => x.Consumable_Category_ID == AddVendorConsumable.Consumable.Consumable_Category_ID);

            if (existingConsumableCategorye != null)
            {
                AddVendorConsumable.Consumable.Consumable_Category = existingConsumableCategorye;
            }

            Vendor_Status existingVendorStatus = await _dbContext.Vendor_Status.FirstOrDefaultAsync(x => x.Vendor_Status_ID == AddVendorConsumable.Vendor.Vendor_Status_ID);

            if (existingVendorStatus != null)
            {
                AddVendorConsumable.Vendor.Vendor_Status = existingVendorStatus;
            }


            await _dbContext.Vendor_Consumable.AddAsync(AddVendorConsumable);
            await _dbContext.SaveChangesAsync();

            return new Vendor_Consumable[] { AddVendorConsumable };
        }

        public async Task<Asset[]> AddAssetAsync(Asset AddAsset)
        {

            await _dbContext.Asset.AddAsync(AddAsset);
            await _dbContext.SaveChangesAsync();

            return new Asset[] { AddAsset };
        }

        public async Task<Procurement_Asset[]> AddProcurementAssetAsync(Procurement_Asset AddProcurementAsset)
        {


            Procurement_Details existingProcurementDetails = await _dbContext.Procurement_Details.FirstOrDefaultAsync(x => x.Procurement_Details_ID == AddProcurementAsset.Procurement_Details_ID);

            if (existingProcurementDetails != null)
            {
                AddProcurementAsset.Procurement_Details = existingProcurementDetails;
            }

            Asset existingAssets = await _dbContext.Asset.FirstOrDefaultAsync(x => x.Asset_ID == AddProcurementAsset.Asset_ID);

            if (existingAssets != null)
            {
                AddProcurementAsset.Asset = existingAssets;
            }

            Employee existingEmployee = await _dbContext.Employee.FirstOrDefaultAsync(x => x.EmployeeID == AddProcurementAsset.Procurement_Details.EmployeeID);

            if (existingEmployee != null)
            {
                AddProcurementAsset.Procurement_Details.Employee = existingEmployee;
            }

            Procurement_Request existingProcurementRequest = await _dbContext.Procurement_Request.FirstOrDefaultAsync(x => x.Procurement_Request_ID == AddProcurementAsset.Procurement_Details.Procurement_Request_ID);

            if (existingProcurementRequest != null)
            {
                AddProcurementAsset.Procurement_Details.Procurement_Request = existingProcurementRequest;


            }

            Sign_Off_Status existingSignOffStatus = await _dbContext.Sign_Off_Status.FirstOrDefaultAsync(x => x.Sign_Off_Status_ID == AddProcurementAsset.Procurement_Details.Sign_Off_Status_ID);

            if (existingSignOffStatus != null)
            {
                AddProcurementAsset.Procurement_Details.Sign_Off_Status = existingSignOffStatus;
            }

            Procurement_Payment_Status existingProcurementPaymentStatus = await _dbContext.Procurement_Payment_Status.FirstOrDefaultAsync(x => x.Procurement_Payment_Status_ID == AddProcurementAsset.Procurement_Details.Procurement_Payment_Status_ID);

            if (existingProcurementPaymentStatus != null)
            {
                AddProcurementAsset.Procurement_Details.Procurement_Payment_Status = existingProcurementPaymentStatus;
            }

            Budget_Line existingBudgetLine = await _dbContext.Budget_Line.FirstOrDefaultAsync(x => x.BudgetLineId == AddProcurementAsset.Procurement_Details.BudgetLineId);

            if (existingBudgetLine != null)
            {
                AddProcurementAsset.Procurement_Details.Budget_Line = existingBudgetLine;
            }

            Procurement_Status existingProcurementStatus = await _dbContext.Procurement_Status.FirstOrDefaultAsync(x => x.Procurement_Status_ID == AddProcurementAsset.Procurement_Details.Procurement_Status_ID);

            if (existingProcurementStatus != null)
            {
                AddProcurementAsset.Procurement_Details.Procurement_Status = existingProcurementStatus;
            }

            Payment_Method existingPaymentMethod = await _dbContext.Payment_Method.FirstOrDefaultAsync(x => x.Payment_Method_ID == AddProcurementAsset.Procurement_Details.Payment_Method_ID);

            if (existingPaymentMethod != null)
            {
                AddProcurementAsset.Procurement_Details.Payment_Method = existingPaymentMethod;
            }

            await _dbContext.Procurement_Asset.AddAsync(AddProcurementAsset);
            await _dbContext.SaveChangesAsync();

            return new Procurement_Asset[] { AddProcurementAsset };
        }

        public async Task<Vendor_Asset[]> AddVendorAssetAsync(Vendor_Asset AddVendorAsset)
        {


            Vendor existingVendor = await _dbContext.Vendor.FirstOrDefaultAsync(x => x.Vendor_ID == AddVendorAsset.Vendor_ID);

            if (existingVendor != null)
            {
                AddVendorAsset.Vendor = existingVendor;
            }

            Asset existingAssets = await _dbContext.Asset.FirstOrDefaultAsync(x => x.Asset_ID == AddVendorAsset.Asset_ID);

            if (existingAssets != null)
            {
                AddVendorAsset.Asset = existingAssets;
            }


            await _dbContext.Vendor_Asset.AddAsync(AddVendorAsset);
            await _dbContext.SaveChangesAsync();

            return new Vendor_Asset[] { AddVendorAsset };
        }

        public async Task<Procurement_Request> UpdateProcurementRequestStatusAsync(int requisition_Status_ID, Procurement_Request ProcurementRequestDetails)
        {
            var ExistingProcurementRequest = await _dbContext.Procurement_Request.FirstOrDefaultAsync(x => x.Procurement_Request_ID == ProcurementRequestDetails.Procurement_Request_ID);

            ExistingProcurementRequest.Requisition_Status = new Requisition_Status();

            Requisition_Status existingRequisitionStatus = await _dbContext.Requisition_Status.FirstOrDefaultAsync(x => x.Requisition_Status_ID == requisition_Status_ID);

            ExistingProcurementRequest.Requisition_Status = existingRequisitionStatus;

            await _dbContext.SaveChangesAsync();

            return ExistingProcurementRequest;
        }

        public async Task<Procurement_Details[]> GetProcurementRequestDetailsAsync()
        {
            IQueryable<Procurement_Details> query = _dbContext.Procurement_Details.Include(x => x.Employee).ThenInclude(x => x.Mandate_Limit).Include(x => x.Employee).ThenInclude(x => x.User).Include(x => x.Procurement_Request).ThenInclude(x => x.Vendor).Include(x => x.Sign_Off_Status).Include(x => x.Procurement_Payment_Status).Include(x => x.Procurement_Status).Include(x => x.Payment_Method).Include(x => x.Budget_Line);

            return await query.ToArrayAsync();
        }

        public async Task<Procurement_Details[]> GetProcurementRequestDetailsFDAsync()
        {
            IQueryable<Procurement_Details> query = _dbContext.Procurement_Details.Include(x => x.Employee).ThenInclude(x => x.Mandate_Limit).Include(x => x.Employee).ThenInclude(x => x.User).Include(x => x.Procurement_Request)
                .ThenInclude(x => x.Vendor).Include(x => x.Sign_Off_Status).Include(x => x.Procurement_Payment_Status).Include(x => x.Procurement_Status).Include(x => x.Payment_Method).Include(x => x.Budget_Line)
                .Where(x => x.Total_Amount > 80000 && x.Total_Amount <= 150000);

            return await query.ToArrayAsync();
        }

        public async Task<Procurement_Details[]> GetProcurementRequestDetailsMDAsync()
        {
            IQueryable<Procurement_Details> query = _dbContext.Procurement_Details.Include(x => x.Employee).ThenInclude(x => x.Mandate_Limit).Include(x => x.Employee).ThenInclude(x => x.User).Include(x => x.Procurement_Request)
                .ThenInclude(x => x.Vendor).Include(x => x.Sign_Off_Status).Include(x => x.Procurement_Payment_Status).Include(x => x.Procurement_Status).Include(x => x.Payment_Method).Include(x => x.Budget_Line)
                .Where(x => x.Total_Amount > 150000);

            return await query.ToArrayAsync();
        }

        public async Task<Procurement_Details> GetProcurementDetailsByIDAsync(int ProcurementDetailsID)
        {
            IQueryable<Procurement_Details> query = _dbContext.Procurement_Details
                                                    .Include(x => x.Employee).ThenInclude(x => x.Mandate_Limit)
                                                    .Include(x => x.Procurement_Request).ThenInclude(x => x.Vendor).ThenInclude(x => x.Vendor_Status)
                                                    .Include(x => x.Procurement_Request).ThenInclude(x => x.User).ThenInclude(x => x.Role)
                                                    .Include(x => x.Procurement_Request).ThenInclude(x => x.User).ThenInclude(x => x.Access)
                                                    .Include(x => x.Procurement_Request).ThenInclude(x => x.Requisition_Status)
                                                    .Include(x => x.Sign_Off_Status)
                                                    .Include(x => x.Procurement_Payment_Status)
                                                    .Include(x => x.Procurement_Status)
                                                    .Include(x => x.Payment_Method)
                                                    .Include(x => x.Budget_Line).ThenInclude(x => x.Budget_Allocation).ThenInclude(x => x.Department)
                                                    .Include(x => x.Budget_Line).ThenInclude(x => x.Budget_Category)
                                                    .Where(x => x.Procurement_Details_ID == ProcurementDetailsID);

            return await query.FirstOrDefaultAsync();
        }

        public async Task<Deposit> GetDepositByIDAsync(int ProcurementRequestID)
        {
            IQueryable<Deposit> query = _dbContext.Deposit.Include(x => x.Procurement_Details).Where(x => x.Procurement_Details_ID == ProcurementRequestID);

            return await query.FirstOrDefaultAsync();
        }

        public async Task<Payment_Made> GetFullPaymentMadeByIDAsync(int ProcurementRequestID)
        {
            IQueryable<Payment_Made> query = _dbContext.Payment_Made.Include(x => x.Procurement_Details).Where(x => x.Procurement_Details_ID == ProcurementRequestID);

            return await query.FirstOrDefaultAsync();
        }
        public async Task<Proof_Of_Payment> GetProofOfPaymentByIDAsync(int ProcurementRequestID)
        {
            IQueryable<Proof_Of_Payment> query = _dbContext.Proof_Of_Payment.Include(x => x.Procurement_Details).Where(x => x.Procurement_Details_ID == ProcurementRequestID);

            return await query.FirstOrDefaultAsync();
        }

        public async Task<Vendor_Consumable[]> GetVendorConsumableAsync()
        {
            IQueryable<Vendor_Consumable> query = _dbContext.Vendor_Consumable.Include(x => x.Consumable).Include(x => x.Vendor);

            return await query.ToArrayAsync();
        }

        public async Task<Vendor_Asset[]> GetVendorAssetAsync()
        {
            IQueryable<Vendor_Asset> query = _dbContext.Vendor_Asset.Include(x => x.Asset).Include(x => x.Vendor);

            return await query.ToArrayAsync();
        }

        public async Task<Procurement_Consumable[]> GetProcurementConsumableAsync()
        {
            IQueryable<Procurement_Consumable> query = _dbContext.Procurement_Consumable.Include(x => x.Consumable).Include(x => x.Procurement_Details);

            return await query.ToArrayAsync();
        }

        public async Task<Procurement_Asset[]> GetProcurementAssetAsync()
        {
            IQueryable<Procurement_Asset> query = _dbContext.Procurement_Asset.Include(x => x.Asset).Include(x => x.Procurement_Details);

            return await query.ToArrayAsync();
        }

        public async Task<Asset> GetAssetByIDAsync(int AssetID)
        {
            IQueryable<Asset> query = _dbContext.Asset.Where(x => x.Asset_ID == AssetID);

            return await query.FirstOrDefaultAsync();
        }

        public async Task<Procurement_Details> UpdateProcurementDetailsStatusAsync(int StatusID, Procurement_Details ProcurementDetails)
        {
            var ExistingProcurementDetails = await _dbContext.Procurement_Details.FirstOrDefaultAsync(x => x.Procurement_Details_ID == ProcurementDetails.Procurement_Details_ID);

            ExistingProcurementDetails.Procurement_Status = new Procurement_Status();

            Procurement_Status existingProcurementStatus = await _dbContext.Procurement_Status.FirstOrDefaultAsync(x => x.Procurement_Status_ID == StatusID);

            ExistingProcurementDetails.Procurement_Status = existingProcurementStatus;

            await _dbContext.SaveChangesAsync();

            return ExistingProcurementDetails;
        }

        public async Task<Procurement_Details> GetProcurementDetailsByRequestIDAsync(int RequestID)
        {
            IQueryable<Procurement_Details> query = _dbContext.Procurement_Details.Where(x => x.Procurement_Request_ID == RequestID);

            return await query.FirstOrDefaultAsync();
        }
        public async Task<Procurement_Details[]> GetUnpaidProcurementDetailsAsync()
        {
            IQueryable<Procurement_Details> query = _dbContext.Procurement_Details.Where(x => x.Procurement_Payment_Status_ID == 2).Include(x => x.Employee)
                .ThenInclude(x => x.Mandate_Limit).Include(x => x.Procurement_Request).ThenInclude(x => x.Vendor).Include(x => x.Sign_Off_Status)
                .Include(x => x.Procurement_Payment_Status).Include(x => x.Procurement_Status).Include(x => x.Payment_Method).Include(x => x.Budget_Line);
            return await query.ToArrayAsync();
        }

        public async Task<Procurement_Consumable> GetConsumableForRequest(int ProcurementRequestID)
        {
            IQueryable<Procurement_Consumable> query = _dbContext.Procurement_Consumable.Include(x => x.Consumable).Include(x => x.Procurement_Details).Where(x => x.Procurement_Details_ID == ProcurementRequestID);

            return await query.FirstOrDefaultAsync();
        }

        public async Task<Procurement_Consumable> GetConsumableForRequestConsRecieve(int ProcurementDetailsID)
        {
            IQueryable<Procurement_Consumable> query = _dbContext.Procurement_Consumable
                .Include(x => x.Consumable)
                .Include(x => x.Procurement_Details)
                .ThenInclude(ps => ps.Procurement_Status)
                .Include(b => b.Procurement_Details)
                .ThenInclude(b => b.Budget_Line)
                .ThenInclude(ba => ba.Budget_Allocation)
                .Include(bl => bl.Procurement_Details)
                .ThenInclude(na => na.Budget_Line)
                .ThenInclude(bc => bc.Budget_Category)
                .Include(pr => pr.Procurement_Details)
                .ThenInclude(e => e.Employee)
                .Include(pr => pr.Procurement_Details)
                .ThenInclude(pm => pm.Payment_Method)
                .Include(pr => pr.Procurement_Details)
                .ThenInclude(pps => pps.Procurement_Payment_Status)
                .Include(pr => pr.Procurement_Details)
                .ThenInclude(Preq => Preq.Procurement_Request)
                .ThenInclude(u => u.User)
                .Include(pd => pd.Procurement_Details)
                .ThenInclude(rs => rs.Procurement_Request)
                .ThenInclude(rs => rs.Requisition_Status)
                .Include(pd => pd.Procurement_Details)
                .ThenInclude(pr => pr.Procurement_Request)
                .ThenInclude(u => u.Vendor)
                .Include(pr => pr.Procurement_Details)
                .ThenInclude(sos => sos.Sign_Off_Status)
                .Where(x => x.Procurement_Details_ID == ProcurementDetailsID);

            return await query.FirstOrDefaultAsync();
        }

        public async Task<Notification[]> AddNotificationAsync(Notification ProcurementNotification)
        {

            Notification_Type existingNotificationType = await _dbContext.Notification_Type.FirstOrDefaultAsync(x => x.Notification_Type_ID == ProcurementNotification.Notification_Type_ID);

            if (existingNotificationType != null)
            {
                ProcurementNotification.Notification_Type = existingNotificationType;
            }

            var existingUser = await _dbContext.User.Include(x=> x.Access).FirstOrDefaultAsync(x => x.User_Id == ProcurementNotification.User_Id);

            if (existingUser != null)
            {
                ProcurementNotification.User = existingUser;
                ProcurementNotification.User.Access = existingUser.Access;
                ProcurementNotification.User.No_Notifications = existingUser.No_Notifications + 1;
            }


            await _dbContext.Notification.AddAsync(ProcurementNotification);
            await _dbContext.SaveChangesAsync();

            return new Notification[] { ProcurementNotification };
        }

        public async Task<Procurement_Details> FinalizeProcurementRequest(int DetailsID)
        {
            Procurement_Details existingDetails = await _dbContext.Procurement_Details.FirstOrDefaultAsync(b => b.Procurement_Details_ID == DetailsID);

            if (existingDetails != null)
            {
                existingDetails.Procurement_Payment_Status_ID = 1;
                existingDetails.Payment_Made = true;
                await _dbContext.SaveChangesAsync();
            }
            return existingDetails;
        }

        public async Task<Procurement_Details> RequisitionApproval(int DetailsID)
        {
            Procurement_Details existingDetails = await _dbContext.Procurement_Details.FirstOrDefaultAsync(b => b.Procurement_Details_ID == DetailsID);

            if (existingDetails != null)
            {
                existingDetails.Procurement_Request.Requisition_Status_ID = 1;
                await _dbContext.SaveChangesAsync();
            }
            return existingDetails;
        }

        public async Task<Procurement_Details[]> GetUnapprovedRequests()
        {
            IQueryable<Procurement_Details> query = _dbContext.Procurement_Details.Include(x => x.Employee)
                  .ThenInclude(x => x.Mandate_Limit).Include(x => x.Procurement_Request).ThenInclude(x => x.Vendor).Include(x => x.Sign_Off_Status)
                  .Include(x => x.Procurement_Payment_Status).Include(x => x.Procurement_Status).Include(x => x.Payment_Method).Include(x => x.Budget_Line);
            return await query.ToArrayAsync();
        }

        public async Task<Budget_Line[]> GetProcurementAccountCodeDetailsAsync(int year, int Month, string department)
        {
            string[] month2Db = {"january" ,
                                                      "february" ,
                                                      "march" ,
                                                     "april" ,
                                                     "may" ,
                                                      "june" ,
                                                      "july" ,
                                                      "august" ,
                                                      "september" ,
                                                      "october" , "november", "december" };

            Console.WriteLine(Array.IndexOf(month2Db,"july"));

            var BudgetLineDetails = await _dbContext.Budget_Line.Include(b => b.Budget_Allocation)
                .ThenInclude(a => a.Department)
                .Include(c => c.Budget_Category)
                .Where(x => (x.Budget_Allocation.Department.Name == department) && (x.Budget_Allocation.Year >= year) ).ToListAsync(); ;
 

            var data = BudgetLineDetails.Where(x => Month <= (Array.IndexOf(month2Db, x.Month.ToLower())+1));

            return data.ToArray();
        }

        public async Task<Asset[]> getAssetsAsync()
        {
            IQueryable<Asset> query = _dbContext.Asset;

            return await query.ToArrayAsync();
        }

        public async Task<Procurement_Status[]> GetAssetStatusesAsync()
        {
            IQueryable<Procurement_Status> Statuses = _dbContext.Procurement_Status.Where(x => x.Procurement_Status_ID >= 5);

            return await Statuses.ToArrayAsync();
        }

        public async Task<Procurement_Details> UpdateProcurementDetailsStatusAsync(int StatusID, int ProcurementID)
        {
            Procurement_Details ExistingPD = await _dbContext.Procurement_Details.FirstOrDefaultAsync(x => x.Procurement_Details_ID == ProcurementID);
            if (StatusID == 5 && ExistingPD.Item_Type == "Consumable")
            {
                
                ExistingPD.Procurement_Status = new Procurement_Status();

                if (ExistingPD.Payment_Made == true)
                {
                    ExistingPD.ItemReceived = true;
                    Procurement_Status ExistingStatus = await _dbContext.Procurement_Status.FirstOrDefaultAsync(x => x.Procurement_Status_ID == 2);

                    ExistingPD.Procurement_Status = ExistingStatus;

                    await _dbContext.SaveChangesAsync();
                }
                else
                {
                    ExistingPD.ItemReceived = true;
                    Procurement_Status ExistingStatus = await _dbContext.Procurement_Status.FirstOrDefaultAsync(x => x.Procurement_Status_ID == StatusID);

                    ExistingPD.Procurement_Status = ExistingStatus;

                    await _dbContext.SaveChangesAsync();
                }

            }

            else if(StatusID == 5 && ExistingPD.Item_Type == "Assets")
            {

                ExistingPD.Procurement_Status = new Procurement_Status();

                if (ExistingPD.Payment_Made == true)
                {
                    ExistingPD.ItemReceived = false;
                    Procurement_Status ExistingStatus = await _dbContext.Procurement_Status.FirstOrDefaultAsync(x => x.Procurement_Status_ID == StatusID);

                    ExistingPD.Procurement_Status = ExistingStatus;

                    await _dbContext.SaveChangesAsync();
                }
                else
                {
                    ExistingPD.ItemReceived = false;
                    Procurement_Status ExistingStatus = await _dbContext.Procurement_Status.FirstOrDefaultAsync(x => x.Procurement_Status_ID == StatusID);

                    ExistingPD.Procurement_Status = ExistingStatus;

                    await _dbContext.SaveChangesAsync();
                }

            }
            else if (StatusID == 6 && ExistingPD.Item_Type == "Assets")
            {

                ExistingPD.Procurement_Status = new Procurement_Status();

                if (ExistingPD.Payment_Made == true)
                {
                    ExistingPD.ItemReceived = false;
                    Procurement_Status ExistingStatus = await _dbContext.Procurement_Status.FirstOrDefaultAsync(x => x.Procurement_Status_ID == StatusID);

                    ExistingPD.Procurement_Status = ExistingStatus;

                    await _dbContext.SaveChangesAsync();
                }
                else
                {
                    ExistingPD.ItemReceived = false;
                    Procurement_Status ExistingStatus = await _dbContext.Procurement_Status.FirstOrDefaultAsync(x => x.Procurement_Status_ID == StatusID);

                    ExistingPD.Procurement_Status = ExistingStatus;

                    await _dbContext.SaveChangesAsync();
                }

            }
            else if (StatusID == 7 && ExistingPD.Item_Type == "Assets")
            {

                ExistingPD.Procurement_Status = new Procurement_Status();

                if (ExistingPD.Payment_Made == true)
                {
                    ExistingPD.ItemReceived = true;
                    Procurement_Status ExistingStatus = await _dbContext.Procurement_Status.FirstOrDefaultAsync(x => x.Procurement_Status_ID == StatusID);

                    ExistingPD.Procurement_Status = ExistingStatus;

                    await _dbContext.SaveChangesAsync();
                }
                else
                {
                    ExistingPD.ItemReceived = true;
                    Procurement_Status ExistingStatus = await _dbContext.Procurement_Status.FirstOrDefaultAsync(x => x.Procurement_Status_ID == StatusID);

                    ExistingPD.Procurement_Status = ExistingStatus;

                    await _dbContext.SaveChangesAsync();
                }

            }


            else
            {
                ExistingPD.Procurement_Status = new Procurement_Status();

                Procurement_Status ExistingStatus = await _dbContext.Procurement_Status.FirstOrDefaultAsync(x => x.Procurement_Status_ID == StatusID);

                ExistingPD.Procurement_Status = ExistingStatus;

                await _dbContext.SaveChangesAsync();
            }

            return ExistingPD;
        }
        public async Task<Procurement_Details> UpdatePaymentStatusAsync(int StatusID, int ProcurementID)
        {
            Procurement_Details ExistingPD = await _dbContext.Procurement_Details.FirstOrDefaultAsync(x => x.Procurement_Details_ID == ProcurementID);


            ExistingPD.Procurement_Payment_Status = new Procurement_Payment_Status();

            Procurement_Payment_Status ExistingStatus = await _dbContext.Procurement_Payment_Status.FirstOrDefaultAsync(x => x.Procurement_Payment_Status_ID == StatusID);

            ExistingPD.Procurement_Payment_Status = ExistingStatus;

            await _dbContext.SaveChangesAsync();

            return ExistingPD;
        }
        public async Task<Budget_Line> UpdateBudgetLineAmountAsync(Budget_Line budget_Line,decimal ActualAmount)
        {
            var budgetline = await _dbContext.Budget_Line.FindAsync(budget_Line.BudgetLineId);

            budgetline.ActualAmt = budget_Line.ActualAmt + ActualAmount;
            budgetline.BudgetAmt = budget_Line.BudgetAmt;
            budgetline.Budget_ID = budget_Line.Budget_ID;
            budgetline.Category_ID = budget_Line.Category_ID;   
            budgetline.Month = budget_Line.Month;
            budgetline.Variance = budget_Line.BudgetAmt - (budget_Line.ActualAmt + ActualAmount); 

            budgetline.Budget_Allocation = new Budget_Allocation();
            budgetline.Budget_Category = new Budget_Category();

            Budget_Allocation existingBudgetAllocation = await _dbContext.Budget_Allocation.Include(x=> x.Department).FirstOrDefaultAsync(ba => ba.Budget_ID == budget_Line.Budget_ID);
            Budget_Category exsitingBudgetCategory = await _dbContext.Budget_Category.FirstOrDefaultAsync(bc => bc.Category_ID == budget_Line.Category_ID);


            budgetline.Budget_Allocation = existingBudgetAllocation;
            budgetline.Budget_Category = exsitingBudgetCategory;

            await _dbContext.SaveChangesAsync();


            return budgetline;
        }



    }
}
