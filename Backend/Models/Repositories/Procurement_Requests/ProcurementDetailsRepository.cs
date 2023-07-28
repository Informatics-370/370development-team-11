using Microsoft.EntityFrameworkCore;
using Org.BouncyCastle.Crypto.Agreement;
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
            IQueryable<Procurement_Request> query = _dbContext.Procurement_Request.Include(x => x.Vendor).ThenInclude(x => x.Vendor_Status).Include(x => x.User).ThenInclude(x => x.Role).Include(x => x.Requisition_Status).Where(x => x.Procurement_Request_ID == ProcurementRequestID);

            return await query.FirstOrDefaultAsync();
        }

        public async Task<Procurement_Request_Quote[]> GetProcurementRequestQuoteByIDAsync(int ProcurementRequestID)
        {
            IQueryable<Procurement_Request_Quote> query = _dbContext.Procurement_Request_Quote.Include(x => x.Procurement_Request).ThenInclude(x => x.Requisition_Status).Where(x => x.Procurement_Request_ID == ProcurementRequestID);

            return await query.ToArrayAsync();
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
                AddPOP.Procurement_Details = existingProcurementDetails;
            }



            await _dbContext.Proof_Of_Payment.AddAsync(AddPOP);
            await _dbContext.SaveChangesAsync();

            return new Proof_Of_Payment[] { AddPOP };
        }

        public async Task<Procurement_Consumable[]> AddProcurementConsumableAsync(Procurement_Consumable AddProcurementConsumable)
        {
            

            Procurement_Details existingProcurementDetails = await _dbContext.Procurement_Details.FirstOrDefaultAsync(x => x.Procurement_Details_ID == AddProcurementConsumable.Procurement_Details_ID);

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

            Asset existingAssets= await _dbContext.Asset.FirstOrDefaultAsync(x => x.Asset_ID == AddProcurementAsset.Asset_ID);

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

            Budget_Line existingBudgetLine = await _dbContext.Budget_Line.FirstOrDefaultAsync(x => x.Account_Code == AddProcurementAsset.Procurement_Details.Account_Code);

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
            IQueryable<Procurement_Details> query = _dbContext.Procurement_Details.Include(x => x.Employee).ThenInclude(x => x.Mandate_Limit).Include(x => x.Procurement_Request).ThenInclude(x=> x.Vendor).Include(x => x.Sign_Off_Status).Include(x => x.Procurement_Payment_Status).Include(x=> x.Procurement_Status).Include(x=> x.Payment_Method).Include(x => x.Budget_Line);

            return await query.ToArrayAsync();
        }

        public async Task<Procurement_Details> GetProcurementDetailsByIDAsync(int ProcurementDetailsID)
        {
            IQueryable<Procurement_Details> query = _dbContext.Procurement_Details.Include(x => x.Employee).ThenInclude(x => x.Mandate_Limit).Include(x => x.Procurement_Request).ThenInclude(x => x.Vendor).Include(x => x.Sign_Off_Status).Include(x => x.Procurement_Payment_Status).Include(x => x.Procurement_Status).Include(x => x.Payment_Method).Include(x => x.Budget_Line).Where(x=> x.Procurement_Details_ID == ProcurementDetailsID);

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
            IQueryable<Asset> query = _dbContext.Asset.Where(x=> x.Asset_ID == AssetID);

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

        public async Task<Notification[]> AddNotificationAsync(Notification ProcurementNotification)
        {

            Notification_Type existingNotificationType = await _dbContext.Notification_Type.FirstOrDefaultAsync(x => x.Notification_Type_ID == ProcurementNotification.Notification_Type_ID);

            if (existingNotificationType != null)
            {
                ProcurementNotification.Notification_Type = existingNotificationType;
            }

            var existingUser = await _dbContext.User.FirstOrDefaultAsync(x => x.User_Id == ProcurementNotification.User_Id);

            if (existingUser != null)
            {
                ProcurementNotification.User = existingUser;
            }


            await _dbContext.Notification.AddAsync(ProcurementNotification);
            await _dbContext.SaveChangesAsync();

            return new Notification[] { ProcurementNotification };
        }

    }
}
