using Microsoft.EntityFrameworkCore;

using ProcionAPI.Data;
using Microsoft.Data.SqlClient;
using Microsoft.SqlServer.Dac;

namespace ProcionAPI.Models.Repositories

{
    public class BackupRepository : IBackupRepository
    {
        private readonly IConfiguration _configuration;
        private readonly AppDBContext _dbContext;
     

        public BackupRepository(IConfiguration configuration, AppDBContext dbContext)
        {
            _configuration = configuration;
            _dbContext = dbContext;
        }


        public async Task<bool> RestoreDatabase(IFormFile backupFile)
        {
            try
            {
                string connectionString = _dbContext.Database.GetDbConnection().ConnectionString;
                string databaseName = new SqlConnectionStringBuilder(connectionString).InitialCatalog;

                DacServices dacServices = new DacServices(connectionString);
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    await connection.OpenAsync();

                    // Define the SQL command to drop the database
                    string dropDatabaseQuery = $"DROP DATABASE IF EXISTS [{databaseName}];";

                    try
                    {
                        using (SqlCommand command = new SqlCommand(dropDatabaseQuery, connection))
                        {
                            await command.ExecuteNonQueryAsync();
                        }
                    }
                    catch (SqlException ex)
                    {
                        using (var bacpacStream = backupFile.OpenReadStream())
                        {
                            BacPackage dacPackage = BacPackage.Load(bacpacStream);

                            dacServices.ImportBacpac(dacPackage, databaseName);
                        }
                    }
                }



                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return false;
            }
        }
    }
}
