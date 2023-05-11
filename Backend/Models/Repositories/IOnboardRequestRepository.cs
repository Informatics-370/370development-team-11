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
    }
}
