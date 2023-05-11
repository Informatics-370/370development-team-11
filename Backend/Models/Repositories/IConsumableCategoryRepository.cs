using ProcionAPI.Models.Entities;

namespace ProcionAPI.Models.Repositories
{
    public interface IConsumableCategoryRepository
    {
        Task<Consumable_Category[]> GetAllCategoriesAsync();
    }
}
