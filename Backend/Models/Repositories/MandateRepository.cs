using ProcionAPI.Data;
using ProcionAPI.Models.Entities;
using Microsoft.EntityFrameworkCore;


namespace ProcionAPI.Models.Repositories
{
    public class MandateRepository : IMandateRepository
    {
        private readonly AppDBContext _dbContext;
        
        public MandateRepository(AppDBContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<Mandate_Limit[]> GetAllMandateLimitsAsync()
        {
            IQueryable<Mandate_Limit> query = _dbContext.Mandate_Limit;
            return await query.ToArrayAsync();
        }

        public async Task<Mandate_Limit> GetMandateLimitAsync(int mandateId)
        {
            IQueryable<Mandate_Limit> query = _dbContext.Mandate_Limit.Where(c => c.Mandate_ID == mandateId);
            return await query.FirstOrDefaultAsync();
        }

        public void Add<T>(T entity) where T: class { _dbContext.Add(entity); }

        public void Delete<T>(T entity) where T: class { _dbContext.Remove(entity); }

        public async Task<bool> SaveChangesAsync()
        {
            return await _dbContext.SaveChangesAsync() > 0;
        }
    }
}
