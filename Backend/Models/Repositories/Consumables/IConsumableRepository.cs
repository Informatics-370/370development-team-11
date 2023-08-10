using ProcionAPI.Models.Entities;

namespace ProcionAPI.Models.Repositories.Consumables
{
    public interface IConsumableRepository
    {
        Task<Consumable[]> GetAllConsumableAsync();
        Task<Consumable[]> AddConsumableAsync(Consumable ConsumableAdd);
        Task<Consumable> GetConsumablesByIDAsync(int id);
        Task<Consumable> DeleteConsumableAsync(int id);
        Task<Consumable> UpdateConsumableAsync(int id, Consumable Request);
        Task<Consumable> ConsumableValidationAsync(string name, string category);
        Task<Consumable_History[]> UpdateStockAsync(Consumable_History HistoryAdd);
        //Task<IEnumerable<int>> PredictStockLevelAsync(int id);
        Task<IEnumerable<(int Year, int Month, int ActualAmount, int PredictedAmount)>> PredictStockLevelAsync(int id);
        Task<Notification[]> AddNotificationAsync(Notification ConsumableNotif);
        Task<Consumable_History> GetConsumableHistoryByIDAsync(int id);
    }
}
