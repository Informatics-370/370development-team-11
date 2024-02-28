using ProcionAPI.Models.Entities;

namespace ProcionAPI.Models.Repositories
{
    public interface IMandateRepository
    {
        Task<Mandate_Limit[]> GetAllMandateLimitsAsync();
        Task<Mandate_Limit> GetMandateLimitAsync(int MandateId);
        void Add<T>(T entity) where T : class;
        void Delete<T>(T entity) where T : class;
        Task<bool> SaveChangesAsync();
        Task<Mandate_Limit> EditMandateValidationAsync(double amount);
        Task<Employee> MandateDeleteUserValidationAsync(int id);
    }
}
