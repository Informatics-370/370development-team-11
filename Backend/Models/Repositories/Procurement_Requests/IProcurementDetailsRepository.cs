using ProcionAPI.Models.Entities;

namespace ProcionAPI.Models.Repositories.Procurement_Requests
{
    public interface IProcurementDetailsRepository
    {
        Task<Procurement_Request> GetProcurementRequestByIDAsync(int ProcurementRequestID);
        Task<Procurement_Details[]> CreateProcurementDetailsAsync(Procurement_Details ProcurementDetails);
        Task<Deposit[]> AddDepositAsync(Deposit DepositDetails);
        Task<Payment_Made[]> AddPaymentMadeAsync(Payment_Made PaymentMadeDetails);
        Task<Proof_Of_Payment[]> AddProofOfPaymentAsync(Proof_Of_Payment AddPOP);
        Task<Procurement_Consumable[]> AddProcurementConsumableAsync(Procurement_Consumable AddProcurementConsumable);
        Task<Vendor_Consumable[]> AddVendorConsumableAsync(Vendor_Consumable AddVendorConsumable);
        Task<Asset[]> AddAssetAsync(Asset AddAsset);
        Task<Procurement_Asset[]> AddProcurementAssetAsync(Procurement_Asset AddProcurementAsset);
        Task<Vendor_Asset[]> AddVendorAssetAsync(Vendor_Asset AddVendorAsset);
    }
}
