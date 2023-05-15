using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using ProcionAPI.Data;
using ProcionAPI.Models.Entities;
using ProcionAPI.Controllers;

namespace ProcionAPI.Models.Repositories
{
    public class ConsumableRepository: IConsumableRepository
    {
        private readonly AppDBContext _dbContext;

        public ConsumableRepository(AppDBContext dbContext)
        {
            _dbContext = dbContext;
        }


        public async Task<Consumable[]> GetAllConsumableAsync()
        {
            IQueryable<Consumable> query = _dbContext.Consumable.Include(c => c.Consumable_Category);
            return await query.ToArrayAsync();
        }

        public async Task<Consumable[]> AddConsumableAsync(Consumable ConsumableAdd)
        {
            // Check if the category already exists ?
            Consumable_Category existingCategory = await _dbContext.Consumable_Category.FirstOrDefaultAsync(c => c.Name == ConsumableAdd.Consumable_Category.Name);


            if (existingCategory != null)
            {
                // Category already exists, assign its ID to the new consumable
                ConsumableAdd.Consumable_Category = existingCategory;
            }



            // Add the consumable to the database and save changes
            await _dbContext.AddAsync(ConsumableAdd);
            await _dbContext.SaveChangesAsync();

            return new Consumable[] { ConsumableAdd };
        }

        public async Task<Consumable> ConsumableValidationAsync(string name, string category)
        {
            Consumable ExistingConsumable = await _dbContext.Consumable.FirstOrDefaultAsync(x => x.Name == name && x.Consumable_Category.Name == category);
            if (ExistingConsumable != null)
            {
                return ExistingConsumable;
            }

            else
            {
                return null;
            }
        }

        public async Task<Consumable> GetConsumablesByIDAsync(int id)
        {
            Consumable ChosenConsumable = await _dbContext.Consumable.FirstOrDefaultAsync(x => x.Consumable_ID == id);
            return ChosenConsumable;
        }

        public async Task<Consumable> DeleteConsumableAsync(int id)
        {
            var ConsumableToDelete = await _dbContext.Consumable.FindAsync(id);
            _dbContext.Consumable.Remove(ConsumableToDelete);
            await _dbContext.SaveChangesAsync();

            return ConsumableToDelete;
        }
        public async Task<Consumable> UpdateConsumableAsync(int id, Consumable Request)
        {
            var consumable = await _dbContext.Consumable.FindAsync(id);

            consumable.Name = Request.Name;
            consumable.Description = Request.Description;
            consumable.On_Hand = Request.On_Hand;
            consumable.Minimum_Reorder_Quantity = Request.Minimum_Reorder_Quantity;
            consumable.Maximum_Reorder_Quantity = Request.Maximum_Reorder_Quantity;

            consumable.Consumable_Category = new Consumable_Category();

            Consumable_Category existingCategory = await _dbContext.Consumable_Category.FirstOrDefaultAsync(c => c.Name == Request.Consumable_Category.Name);

            consumable.Consumable_Category = existingCategory;

            await _dbContext.SaveChangesAsync();

            return consumable;
        }




    }
}
