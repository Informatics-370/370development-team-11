using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using ProcionAPI.Data;
using ProcionAPI.Models.Entities;
using ProcionAPI.Controllers;

namespace ProcionAPI.Models.Repositories
{
    public class DelegationRepository : IDelegationRepository
    {
        private readonly AppDBContext _dbContext;

        public DelegationRepository(AppDBContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<Delegation_Of_Authority[]> GetAllDelegationsAsync()
        {
            IQueryable<Delegation_Of_Authority> query = _dbContext.Delegation_Of_Authority.Include(u => u.User);

            return await query.ToArrayAsync();
        }
    }
}
