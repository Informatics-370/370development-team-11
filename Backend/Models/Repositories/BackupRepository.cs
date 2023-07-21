using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using ProcionAPI.Data;
using System;
using System.Configuration;
using System.IO;
using System.Threading.Tasks;
using Microsoft.SqlServer.Management.Smo;
using Microsoft.Data.SqlClient;
using Microsoft.SqlServer.Management.Common;

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

        public async Task<bool> CreateBackup()
        {
            try
            {
                string connectionString = _dbContext.Database.GetDbConnection().ConnectionString;

                // Generate a unique backup file name with timestamp
                string backupFileName = $"Backup_{DateTime.Now:yyyyMMdd_HHmmss}.bak";

                // Specify the backup directory path
                string backupDirectory = _configuration.GetValue<string>("BackupDirectory");

                // Full backup file path
                string backupFilePath = Path.Combine(backupDirectory, backupFileName);

                // Create a new SqlConnectionStringBuilder and set the connection string
                var connectionStringBuilder = new SqlConnectionStringBuilder(connectionString);

                // Extract the server name from the connection string
                string serverName = connectionStringBuilder.DataSource;

                // Extract the database name from the connection string
                string databaseName = connectionStringBuilder.InitialCatalog;

                // Create a new ServerConnection
                var serverConnection = new ServerConnection(serverName);
                serverConnection.LoginSecure = true; // Use Windows authentication or provide login credentials if required

                // Create a new Server object using the ServerConnection
                var server = new Server(serverConnection);

                // Create a new Backup object and set properties
                var backup = new Backup
                {
                    Action = BackupActionType.Database,
                    Database = databaseName,
                    Initialize = true,
                    Checksum = true
                };

                // Specify the backup file name and path
                backup.Devices.AddDevice(backupFilePath, DeviceType.File);

                // Perform the backup asynchronously
                await Task.Run(() => backup.SqlBackup(server));

                return true;
            }
            catch (Exception ex)
            {
                // Log or handle the exception as per your project's requirements
                return false;
            }
        }

        
    }
}
