using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using ProcionAPI.Data;
using ProcionAPI.Models.Entities;
using ProcionAPI.Controllers;

namespace ProcionAPI.Models.Repositories
{
    public class HelpRepository : IHelpRepository
    {
        private readonly AppDBContext _dbContext;

        public HelpRepository(AppDBContext dbContext) 
        {
            _dbContext = dbContext;
        }

        public async Task<HELP[]> GetAllHelpsAsync()
        {
            IQueryable<HELP> query = _dbContext.HELP.Include(c => c.Help_Category);
            return await query.ToArrayAsync();
        }
        public async Task<Help_Category[]> GetAllHelpCategorysAsync()
        {
            IQueryable<Help_Category> query = _dbContext.Help_Category;
            return await query.ToArrayAsync();
        }


        public async Task<HELP> GetHelpAsync(int Help_ID)
        {
            IQueryable<HELP> query = _dbContext.HELP.Include(s => s.Help_Category).Where(c => c.Help_ID == Help_ID);
            return await query.FirstOrDefaultAsync();
        }


        public async Task<HELP[]> AddHelpAsync(HELP AddHelp)
        {
            Help_Category existingHelp_Category = await _dbContext.Help_Category.FirstOrDefaultAsync(d => d.Name == AddHelp.Help_Category.Name);
            


            if (existingHelp_Category != null)
            {

                AddHelp.Help_Category = existingHelp_Category;
            }

            // Add the Help to the database and save changes
            await _dbContext.HELP.AddAsync(AddHelp);
            await _dbContext.SaveChangesAsync();

            return new HELP[] { AddHelp };
        }

        public async Task<HELP> HelpValidationAsync(string name)
        {
            HELP ExistingHelp = await _dbContext.HELP.FirstOrDefaultAsync(x => x.Name.ToLower() == name.ToLower());
            if (ExistingHelp != null)
            {
                return ExistingHelp;
            }

            else
            {
                return null;
            }
        }
        public async Task<HELP> EditHelpValidationAsync(string name, int id)
        {
            HELP ExistingHelp = await _dbContext.HELP.FirstOrDefaultAsync(x => x.Name == name && x.Help_ID == id);
            if (ExistingHelp != null)
            {
                return ExistingHelp;
            }

            else
            {
                return null;
            }
        }

        public void Delete<T>(T entity) where T : class
        {
            _dbContext.Remove(entity);
        }

        public async Task<bool> SaveChangesAsync()
        {
            return await _dbContext.SaveChangesAsync() > 0;
        }

        public async Task<HELP> UpdateHelpAsync(HELP HelpEdit, int helpID)
        {
            var help = await _dbContext.HELP.FindAsync(helpID);

            help.Name = HelpEdit.Name;
            help.Description = HelpEdit.Description;
            help.Video = HelpEdit.Video;
            help.User_Manual = HelpEdit.User_Manual;
            help.Help_Category_ID = HelpEdit.Help_Category_ID;

            help.Help_Category = new Help_Category();

            Help_Category existingCat = await _dbContext.Help_Category.FirstOrDefaultAsync(c => c.Name == HelpEdit.Help_Category.Name);

            help.Help_Category = existingCat;

            await _dbContext.SaveChangesAsync();

            return help;
        }
    }
}
