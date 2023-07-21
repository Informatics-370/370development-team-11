using Microsoft.EntityFrameworkCore;
using ProcionAPI.Data;
using ProcionAPI.Models.Entities;

namespace ProcionAPI.Models.Repositories.Procurement_Requests
{
    public class ProcurementDetailsRepository : IProcurementDetailsRepository
    {
        private readonly AppDBContext _dbContext;

        public ProcurementDetailsRepository(AppDBContext dbContext)
        {
            _dbContext = dbContext;
        }
    }
}
