using Azure.Core;
using ProcionAPI.Models.Entities;
using ProcionAPI.ViewModel;

namespace ProcionAPI.Models.Repositories
{
    public interface IOnboardRequestRepository
    {
        Task<VendorOnboardRequestVM[]> GetAllOnBoardRequestAsync();
        Task<Onboard_Request[]> AddRequestAsync(Onboard_Request RequestAdd);
        Task<Vendor[]> GetAllVendorRequestsAsync();
        Task<Vendor> GetVendorValidationAsync(string sVendorName);
        Task<Onboard_Request[]> GetRequestsAsync(int RequestID);
        Task<Onboard_Request>  EditRequestAsync(int RequestID, Onboard_Request UpdatedRequest);
        Task<Onboard_Request> DeleteRequestAsync(int RequestId,int VendorID);

        Task<Sole_Supplier[]> AddSoleSupplierDetailsAsync(int VendorID, Sole_Supplier soleSupplier);

        Task<Sole_Supplier> GetSoleSupplierByIDAsync(int VendorID);

        Task<Sole_Supplier> UpdateSoleSupplierAsync(int SoleSupplierID, Sole_Supplier UpdatedSoleSupplier);
        Task<Sole_Supplier> DeleteSoleSupplierAsync(int VendorID);
        Task<Vendor> DeleteVendorAsync(int VendorID);
        Task<Vendor_Detail[]> GetAllApprovedVendorRequestsAsync();
    }
}
