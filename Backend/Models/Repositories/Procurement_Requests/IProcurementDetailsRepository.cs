using ProcionAPI.Models.Entities;

namespace ProcionAPI.Models.Repositories.Procurement_Requests
{
    public interface IProcurementDetailsRepository
    {
        Task<Procurement_Request> GetProcurementRequestByIDAsync(int ProcurementRequestID);
        Task<Procurement_Request_Quote[]> GetProcurementRequestQuoteByIDAsync(int ProcurementRequestID);
        Task<Procurement_Details[]> CreateProcurementDetailsAsync(Procurement_Details ProcurementDetails);
        Task<Deposit[]> AddDepositAsync(Deposit DepositDetails);
        Task<Payment_Made[]> AddPaymentMadeAsync(Payment_Made PaymentMadeDetails);
        Task<Proof_Of_Payment[]> AddProofOfPaymentAsync(Proof_Of_Payment AddPOP);
        Task<Procurement_Consumable[]> AddProcurementConsumableAsync(Procurement_Consumable AddProcurementConsumable);
        Task<Vendor_Consumable[]> AddVendorConsumableAsync(Vendor_Consumable AddVendorConsumable);
        Task<Asset[]> AddAssetAsync(Asset AddAsset);
        Task<Procurement_Asset[]> AddProcurementAssetAsync(Procurement_Asset AddProcurementAsset);
        Task<Vendor_Asset[]> AddVendorAssetAsync(Vendor_Asset AddVendorAsset);
        Task<Procurement_Request> UpdateProcurementRequestStatusAsync(int requisition_Status_ID, Procurement_Request ProcurementRequestDetails);
        Task<List<Procurement_Details>> GetProcurementRequestDetailsAsync(string Username);
        Task<Procurement_Details[]> GetProcurementRequestDetailsFDAsync();
        Task<Procurement_Details[]> GetProcurementRequestDetailsBOAsync();
        Task<Procurement_Details[]> GetProcurementRequestDetailsMDAsync();
        Task<Procurement_Details> GetProcurementDetailsByIDAsync(int ProcurementDetailsID);
        Task<Deposit> GetDepositByIDAsync(int ProcurementRequestID);
        Task<Payment_Made> GetFullPaymentMadeByIDAsync(int ProcurementRequestID);
        Task<Proof_Of_Payment> GetProofOfPaymentByIDAsync(int ProcurementRequestID);
        Task<Vendor_Consumable[]> GetVendorConsumableAsync();
        Task<Vendor_Asset[]> GetVendorAssetAsync();
        Task<Procurement_Consumable[]> GetProcurementConsumableAsync();
        Task<Procurement_Asset[]> GetProcurementAssetAsync();
        Task<Asset> GetAssetByIDAsync(int AssetID);
        Task<Procurement_Details> UpdateProcurementDetailsStatusAsync(int StatusID, Procurement_Details ProcurementDetails);

        Task<Procurement_Details> GetProcurementDetailsByRequestIDAsync(int RequestID);
        Task<Notification[]> AddNotificationAsync(Notification ProcurementNotification);
        Task<Procurement_Details[]> GetUnpaidProcurementDetailsAsync();
        Task<Procurement_Consumable> GetConsumableForRequest(int ProcurementRequestID);
        Task<Procurement_Details> FinalizeProcurementRequest(int DetailsID);
        Task<Procurement_Details> RequisitionApproval(int DetailsID);
        Task<Procurement_Details[]> GetUnapprovedRequests();
        Task<Procurement_Consumable> GetConsumableForRequestConsRecieve(int ProcurementDetailsID);
        Task<Budget_Line[]> GetProcurementAccountCodeDetailsAsync(int year, int Month, string department);
        Task<Asset[]> getAssetsAsync();
        Task<Procurement_Details> UpdateProcurementDetailsStatusAsync(int StatusID, int ProcurementID);
        Task<Procurement_Details> UpdatePaymentStatusAsync(int StatusID, int ProcurementID);
        Task<Procurement_Invoice[]> AddInvoiceAsync(Procurement_Invoice AddINV);
        Task<Budget_Line> UpdateBudgetLineAmountAsync(Budget_Line budget_Line, decimal ActualAmount);
        Task<Procurement_Status[]> GetAssetStatusesAsync();
        Task<Procurement_Consumable> GetProcurementConsumablebyIDAsync(int DetailsID);
        Task<Proof_Of_Payment> GetProofofPaymentsAsync(int DetailsID);
        Task<Procurement_Invoice[]> GetInvoicesAsync(int DetailsID);
        Task<Procurement_Asset> GetProcurementAssetbyIDAsync(int DetailsID);



    }
}

