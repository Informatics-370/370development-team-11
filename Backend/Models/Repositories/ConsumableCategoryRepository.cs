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

        public async Task<Consumable_Category[]> AddCategoryAsync(Consumable_Category CategoryAdd)
        { 

            // Add the consumable to the database and save changes
            await _dbContext.AddAsync(CategoryAdd);
            await _dbContext.SaveChangesAsync();

            return new Consumable_Category[] { CategoryAdd };
        }
        public async Task<Consumable_Category> GetCategoryByIDAsync(int id)
        {
            Consumable_Category ChosenCategory = await _dbContext.Consumable_Category.FirstOrDefaultAsync(x => x.Consumable_Category_ID == id);
            return ChosenCategory;
        }

        public async Task<Consumable_Category> UpdateConsumableCategoryAsync(int id, Consumable_Category Request)
        {
            var Category = await _dbContext.Consumable_Category.FindAsync(id);

            Category.Name = Request.Name;
            Category.Description = Request.Description;

            await _dbContext.SaveChangesAsync();

            return Category;
        }

        public async Task<Consumable_Category> DeleteCategoryAsync(int id)
        {
            var CategoryToDelete = await _dbContext.Consumable_Category.FindAsync(id);
            _dbContext.Consumable_Category.Remove(CategoryToDelete);
            await _dbContext.SaveChangesAsync();

            return CategoryToDelete;
        }

        public async Task<Consumable_Category> CategoryValidationAsync(string name)
        {
            Consumable_Category ExistingCategory = await _dbContext.Consumable_Category.FirstOrDefaultAsync(x => x.Name.ToLower() == name.ToLower());
            if (ExistingCategory != null)
            {
                return ExistingCategory;
            }

            else
            {
                return null;
            }
        }
    }
}
