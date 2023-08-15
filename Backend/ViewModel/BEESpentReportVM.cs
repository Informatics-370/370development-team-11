using ProcionAPI.Models.Entities;

namespace ProcionAPI.ViewModel
{
    public class BEESpentReportVM
    {
        public string BranchName { get; set; }
        public decimal TotalSpend { get; set; } 
        public int BEE_Level { get; set; }  
    }
}
