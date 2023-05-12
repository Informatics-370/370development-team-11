using ProcionAPI.Models.Entities;

namespace ProcionAPI.Models.Repositories
{
    public interface IConsumableCategoryRepository
    {
        Task<Consumable_Category[]> GetAllCategoriesAsync();
        Task<Consumable_Category[]> AddCategoryAsync(Consumable_Category CategoryAdd);
        Task<Consumable_Category> GetCategoryByIDAsync(int id);
        Task<Consumable_Category> UpdateConsumableCategoryAsync(int id, Consumable_Category Request);
        Task<Consumable_Category> DeleteCategoryAsync(int id);
        Task<Consumable_Category> CategoryValidationAsync(string name, string description);
    }
}
