using ProcionAPI.Models.Entities;

namespace ProcionAPI.Models.Repositories
{
    public interface IConsumableRepository
    {
        Task<Consumable[]> GetAllConsumableAsync();
        Task<Consumable[]> AddConsumableAsync(Consumable ConsumableAdd);
        Task<Consumable> GetConsumablesByIDAsync(int id);
        Task<Consumable> DeleteConsumableAsync(int id);
        Task<Consumable> UpdateConsumableAsync(int id, Consumable Request);
        Task<Consumable> ConsumableValidationAsync(string name);
    }
}
