using ProcionAPI.Models.Entities;
using ProcionAPI.ViewModel;

namespace ProcionAPI.Models.Repositories
{
    public interface IReportsRepository
    {
        Task<BEESpentReportVM[]> getBEESpendReportAsync();
    }
}
