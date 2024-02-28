using ProcionAPI.Models.Entities;

namespace ProcionAPI.ViewModel
{
    public class ReportData
    {
        public List<ConsumableWithHistory> Consumables { get; set; }
    }

    public class ConsumableWithHistory
    {
        public Consumable Consumable { get; set; }
        public List<Consumable_History> History { get; set; }
    }
}
