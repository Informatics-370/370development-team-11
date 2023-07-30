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
        Task<HELP> HelpValidationAsync(string name);
        Task<HELP> EditHelpValidationAsync(string name, int id);
        Task<bool> SaveChangesAsync();
        Task<HELP> UpdateHelpAsync(HELP HelpEdit, int helpID);
    }
}
