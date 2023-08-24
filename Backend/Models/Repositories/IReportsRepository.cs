using ProcionAPI.Models.Entities;
using ProcionAPI.ViewModel;

namespace ProcionAPI.Models.Repositories
{
    public interface IReportsRepository
    {
        Task<BEESpentReportVM[]> getBEESpendReportAsync(DateTime StartDate, DateTime EndDate); 
        Task<VendorSpentReport[]> getVendorSpentReportAsync(DateTime StartDate, DateTime EndDate);
    }
}
