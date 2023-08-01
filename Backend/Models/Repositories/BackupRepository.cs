using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using ProcionAPI.Data;
using System;
using System.Configuration;
using System.IO;
using System.Threading.Tasks;
using Microsoft.SqlServer.Management.Smo;
using Microsoft.Data.SqlClient;
using Microsoft.SqlServer.Management.Common;
using Microsoft.AspNetCore.Http.HttpResults;

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

                string currentUser = System.Security.Principal.WindowsIdentity.GetCurrent().Name;
                Console.WriteLine($"Current user: {currentUser}");
                string connectionString = _dbContext.Database.GetDbConnection().ConnectionString;

                // Generate a unique backup file name with timestamp
                string backupFileName = $"Backup_{DateTime.Now:yyyyMMdd_HHmmss}.bak";

                // Specify the backup directory path
                // Full backup file path
                var folderPath = Path.Combine("C:\\Backup", "BackupDirectory");
                var pToUse = Path.Combine(folderPath, backupFileName);
               
                var absoluteFolderPath = Path.Combine(Directory.GetCurrentDirectory(), folderPath);
                if (!Directory.Exists(absoluteFolderPath))
                {
                    Directory.CreateDirectory(absoluteFolderPath);
                }
                // Create a new SqlConnectionStringBuilder and set the connection string
                var connectionStringBuilder = new SqlConnectionStringBuilder(connectionString);
                Console.WriteLine(connectionStringBuilder.ToString());

                // Extract the server name from the connection string
                string serverName = connectionStringBuilder.DataSource;
                Console.WriteLine(serverName);

                // Extract the database name from the connection string
                string databaseName = connectionStringBuilder.InitialCatalog;
                Console.WriteLine(databaseName);

                // Create a new ServerConnection
                var serverConnection = new ServerConnection(serverName);
                serverConnection.LoginSecure = true; // Use Windows authentication or provide login credentials if required
                serverConnection.TrustServerCertificate = true;
                serverConnection.MultipleActiveResultSets = true;

                Console.WriteLine(serverConnection.ConnectionString);
                // Create a new Server object using the ServerConnection
                var server = new Server(serverConnection);
                Console.WriteLine(server);
                // Create a new Backup object and set properties
                var backup = new Backup
                {
                    Action = BackupActionType.Database,
                    Database = databaseName,
                    Initialize = true,
                    Checksum = true
                };
                Console.WriteLine(backup.Action);
                // Specify the backup file name and path
                //backup.Devices.AddDevice("C:\\Program Files\\Microsoft SQL Server\\MSSQL15.MSSQLSERVER\\MSSQL\\Backup\\", DeviceType.File);
                backup.Devices.AddDevice(pToUse, DeviceType.File);
                // Perform the backup asynchronously
                Task.Run(() => backup.SqlBackup(server));

                return true;
            }
            catch (Exception ex)
            {
                // Log or handle the exception as per your project's requirements
                Console.WriteLine(($"Backup failed: {ex.Message}\nStackTrace: {ex.StackTrace}"));
                return false;
               
            }
        }

        


        public async Task<bool> RestoreDatabase(IFormFile backupFile)
        {
            try
            {
                Console.WriteLine(backupFile.FileName);
                if (backupFile == null || backupFile.Length <= 0)
                {
                    throw new ArgumentException("Please select a backup file to restore the database.");
                }

                string connectionString = _configuration.GetConnectionString("RestoreConnection");
                string DefaultString = _configuration.GetConnectionString("DefaultConnection");
                string sqlServerBasePath = _configuration.GetValue<string>("SqlServerBasePath");
                string backupDirectory = _configuration.GetValue<string>("BackupDirectory");
                Console.WriteLine(connectionString);
                Console.WriteLine(sqlServerBasePath);
                Console.WriteLine(backupDirectory);
                Console.WriteLine("Success");

                // Save the uploaded backup file to a temporary location
                var tempFilePath = Path.Combine(backupDirectory, "TempFile.bak");
                Console.WriteLine(tempFilePath);
                using (var stream = new FileStream(tempFilePath, FileMode.Create))
                {
                    await backupFile.CopyToAsync(stream);
                }

                // Create a new ServerConnection
                var DefaultCOnnect = new ServerConnection();
                DefaultCOnnect.ConnectionString = DefaultString;
                var serverConnection = new ServerConnection();
                serverConnection.ConnectionString = connectionString;
                Console.WriteLine(serverConnection.ConnectionString);
                Console.WriteLine("Success");

                // Create a new Server object using the ServerConnection
                var server = new Server(serverConnection);
                Console.WriteLine(server);
                Console.WriteLine("Success");

                // Create a new Restore object and set properties
                var restore = new Restore
                {
                    Database = "ProcionAPI.Data", // Set the default database name
                    Action = RestoreActionType.Database,
                    ReplaceDatabase = true,
                    NoRecovery = false,
                };
                Console.WriteLine(restore.Database);
                Console.WriteLine("Success");

                // Specify the backup file to restore from
                restore.Devices.AddDevice(tempFilePath, DeviceType.File);
                Console.WriteLine("Success");

                // Ensure the 'ProcionAPI.Data' database is closed

                server.KillAllProcesses("ProcionAPI.Data");
                DefaultCOnnect.Disconnect();
                


                // Perform the restore asynchronously
                restore.SqlRestore(server);


                // Delete the temporary file after restore
                File.Delete(tempFilePath);
                Console.WriteLine("Success");

                return true;
            }
            catch (Exception ex)
            {
                // Log or handle the exception as per your project's requirements
                Console.WriteLine(ex.Message);
                throw;
            }
        }

        // TempFilePath
        //public async Task<bool> RestoreDatabase(IFormFile backupFile)
        //{
        //    try
        //    {
        //        if (backupFile == null || backupFile.Length <= 0)
        //        {
        //            throw new ArgumentException("Please select a backup file to restore the database.");
        //        }
        //        Console.WriteLine(backupFile.FileName);

        //        string connectionString = _configuration.GetConnectionString("DefaultConnection");
        //        string sqlServerBasePath = _configuration.GetValue<string>("SqlServerBasePath");
        //        string backupDirectory = _configuration.GetValue<string>("BackupDirectory");
        //        Console.WriteLine(connectionString);
        //        Console.WriteLine(sqlServerBasePath);
        //        Console.WriteLine(backupDirectory);
        //        // Save the uploaded backup file to a temporary location
        //        var tempFilePath = Path.Combine(Path.GetTempPath(), Path.GetRandomFileName() + ".bak");
        //        using (var stream = new FileStream(tempFilePath, FileMode.Create))
        //        {
        //            await backupFile.CopyToAsync(stream);
        //        }
        //        Console.WriteLine(tempFilePath);

        //        // Create a new ServerConnection
        //        var serverConnection = new ServerConnection();
        //        serverConnection.ConnectionString = connectionString;
        //        Console.WriteLine(serverConnection.ConnectionString);
        //        // Create a new Server object using the ServerConnection
        //        var server = new Server(serverConnection);
        //        Console.WriteLine(server);
        //        // Create a new Restore object and set properties
        //        var restore = new Restore
        //        {
        //            //Database = "MOSQ - YEET - OES@ProcionAPI.Data",
        //           Database = "ProcionAPI.Data", // Set the default database name
        //            Action = RestoreActionType.Database,
        //            ReplaceDatabase = true,
        //            NoRecovery = false,
        //        };
        //        Console.WriteLine(restore.Database);
        //        // Specify the backup file to restore from
        //        restore.Devices.AddDevice(tempFilePath, DeviceType.File);

        //        // Perform the restore asynchronously
        //        restore.SqlRestore(server);

        //        // Delete the temporary file after restore
        //        File.Delete(tempFilePath);

        //        return true;
        //    }
        //    catch (Exception ex)
        //    {
        //        // Log or handle the exception as per your project's requirements
        //        throw;
        //    }
        //}


        //No TempFilePath
        //public async Task<bool> RestoreDatabase(IFormFile backupFile)
        //{
        //    try
        //    {
        //        if (backupFile == null || backupFile.Length <= 0)
        //        {
        //            throw new ArgumentException("Please select a backup file to restore the database.");
        //        }

        //        string connectionString = _configuration.GetConnectionString("DefaultConnection");
        //        string sqlServerBasePath = _configuration.GetValue<string>("SqlServerBasePath");
        //        string backupDirectory = _configuration.GetValue<string>("BackupDirectory");
        //        Console.WriteLine(connectionString);
        //        Console.WriteLine(sqlServerBasePath);
        //        Console.WriteLine(backupDirectory);

        //        // Create a new ServerConnection
        //        var serverConnection = new ServerConnection();
        //        serverConnection.ConnectionString = connectionString;
        //        Console.WriteLine(serverConnection.ConnectionString);

        //        // Create a new Server object using the ServerConnection
        //        var server = new Server(serverConnection);
        //        Console.WriteLine(server);

        //        // Create a new Restore object and set properties
        //        var restore = new Restore
        //        {
        //            Database = "ProcionAPI.Data", // Set the default database name
        //            Action = RestoreActionType.Database,
        //            ReplaceDatabase = true,
        //            NoRecovery = false,
        //        };
        //        Console.WriteLine(restore.Database);

        //        // Read the backup file directly from the IFormFile and add it to the Restore.Devices collection
        //        using (var stream = backupFile.OpenReadStream())
        //        {
        //            restore.Devices.AddDevice(stream, DeviceType.File);
        //            // Perform the restore asynchronously
        //            restore.SqlRestore(server);
        //        }

        //        return true;
        //    }
        //    catch (Exception ex)
        //    {
        //        // Log or handle the exception as per your project's requirements
        //        throw;
        //    }
        //}



    }
}
