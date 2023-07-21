using ProcionAPI.Models.Entities;

namespace ProcionAPI.Models.Repositories.Procurement_Requests
{
    public interface IProcurementDetailsRepository
    {
        Task<Procurement_Request> GetProcurementRequestByIDAsync(int ProcurementRequestID);
        Task<Procurement_Details[]> CreateProcurementDetailsAsync(Procurement_Details ProcurementDetails);
    }
}
