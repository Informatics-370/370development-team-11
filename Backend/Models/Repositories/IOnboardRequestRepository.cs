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
        Task<Vendor> EditVendorAsync(int Vendor_ID, Vendor Request);
        Task<Onboard_Request[]> GetRequestsAsync(int RequestID);
        Task<Onboard_Request>  EditRequestAsync(int RequestID, int VendorID, Onboard_Request UpdatedRequest);
        Task<Onboard_Request> DeleteRequestAsync(int RequestId,int VendorID);
    }
}
