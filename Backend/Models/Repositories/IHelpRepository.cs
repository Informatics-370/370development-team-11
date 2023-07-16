using ProcionAPI.Models.Entities;

namespace ProcionAPI.Models.Repositories
{
    public interface IHelpRepository 
    {
        Task<HELP[]> GetAllHelpsAsync();
        Task<Help_Category[]> GetAllHelpCategorysAsync();
        Task<HELP[]> AddHelpAsync(HELP AddHelp);
        Task<HELP> GetHelpAsync(int Help_ID);
        void Delete<T>(T entity) where T : class;
        Task<HELP> HelpValidationAsync(string name, string category);
        Task<bool> SaveChangesAsync();
    }
}
