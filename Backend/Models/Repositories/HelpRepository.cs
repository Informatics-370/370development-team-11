using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using ProcionAPI.Data;
using ProcionAPI.Models.Entities;
using ProcionAPI.Controllers;
using Microsoft.Data.SqlClient;
using System.Data;

namespace ProcionAPI.Models.Repositories
{
    public class HelpRepository : IHelpRepository
    {
        private readonly AppDBContext _dbContext;
        private readonly IConfiguration _configuration;

        public HelpRepository(AppDBContext dbContext, IConfiguration configuration)
        {
            _dbContext = dbContext;
            _configuration = configuration;
        }

        public async Task<List<HELP>> GetAllHelpsAsync()
        {
            List<HELP> helps = new List<HELP>();
            using (SqlConnection connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await connection.OpenAsync();
                {
                    using (SqlCommand command = new SqlCommand("GetAllHelps", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;
                        using (SqlDataReader reader = await command.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                HELP help = new HELP();
                                help.Help_ID = Convert.ToInt32(reader["Help_ID"]);
                                help.Name = reader["Name"].ToString();
                                help.Description = reader["Description"].ToString();
                                help.Video = reader["Video"].ToString();
                                help.User_Manual = reader["User_Manual"].ToString();
                                help.Help_Category_ID = Convert.ToInt32(reader["Help_Category_ID"]);
                                help.Help_Category = new Help_Category();
                                help.Help_Category.Name = reader["Category_Name"].ToString();
                                help.Help_Category.Description = reader["Category_Description"].ToString();
                                help.Help_Category.Help_Category_ID = Convert.ToInt32(reader["Help_Category_ID"]);
                                helps.Add(help);
                            }
                        }
                    }
                }
            }
            return helps;
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
            HELP ExistingHelp = await _dbContext.HELP.FirstOrDefaultAsync(x => x.Name == name);
            if (ExistingHelp != null)
            {
                if (ExistingHelp.Help_ID == id)
                {
                    return null;
                }
                else
                {
                    return ExistingHelp;
                }
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
