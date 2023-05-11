using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using ProcionAPI.Data;
using ProcionAPI.Models.Entities;
using ProcionAPI.Controllers;

namespace ProcionAPI.Models.Repositories
{
    public class ConsumableCategoryRepository: IConsumableCategoryRepository
    {
        private readonly AppDBContext _dbContext;

        public ConsumableCategoryRepository(AppDBContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<Consumable_Category[]> GetAllCategoriesAsync()
        {
            IQueryable<Consumable_Category> query = _dbContext.Consumable_Category;
            return await query.ToArrayAsync();
        }
    }
}
