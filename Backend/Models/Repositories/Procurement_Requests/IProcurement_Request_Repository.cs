using ProcionAPI.Models.Entities;

namespace ProcionAPI.Models.Repositories.Procurement_Requests
{
    public interface IProcurement_Request_Repository
    {
        Task<Procurement_Request[]> GetProcurementRequestsAsync();
        Task<Procurement_Request[]> AddProcurementRequestAsync(Procurement_Request RequestAdd);
        Task<Procurement_Request_Quote[]> CreateProcurementQuoteAsync(Procurement_Request_Quote RequestAdd);
        Task<Procurement_Request_Quote[]> GetProcurementQuotesAsync();
        Task<Procurement_Request> DeleteProcurementRequestAsync(int id);
        Task<Procurement_Request> GetRequestByIDAsync(int id);

        Task<Procurement_Request_Quote[]> GetProcurementQuotesbyIDAsync(int id);
    }
}
