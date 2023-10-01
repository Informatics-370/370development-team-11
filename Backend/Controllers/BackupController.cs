using Microsoft.AspNetCore.Mvc;
using ProcionAPI.Models.Repositories;
using Microsoft.SqlServer.Management.Smo;
using MailKit;
using Azure.Storage.Blobs.Models;
using Azure.Storage.Blobs;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using ProcionAPI.Data;
using Microsoft.SqlServer.Dac;

namespace ProcionAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BackupController : Controller
    {
        private readonly IBackupRepository _backupRepository;
        private readonly AppDBContext _dbContext;
        public BackupController(IBackupRepository BackupRepository, AppDBContext dbContext)
        {
            _backupRepository = BackupRepository;
            _dbContext = dbContext;
        }

        [HttpPost]
        [Route("CreateBackup")]
        public async Task<IActionResult> CreateBackup()
        {
            try
            {

                string currentUser = System.Security.Principal.WindowsIdentity.GetCurrent().Name;
                Console.WriteLine($"Current user: {currentUser}");
                string connectionString = _dbContext.Database.GetDbConnection().ConnectionString;

                // Create a new DacServices instance
                var dacServices = new DacServices(connectionString);

                // Extract the database name from the connection string
                string databaseName = new SqlConnectionStringBuilder(connectionString).InitialCatalog;
                Console.WriteLine(databaseName);

                // Create a MemoryStream to hold the BACPAC data
                using (var memoryStream = new MemoryStream())
                {
                    // Generate a BACPAC file into the MemoryStream
                    dacServices.ExportBacpac(memoryStream, databaseName);

                    // Set the MemoryStream position to the beginning
                    memoryStream.Seek(0, SeekOrigin.Begin);

                    // Connect to your Azure Blob Storage account
                    string storageConnectionString = "DefaultEndpointsProtocol=https;AccountName=procionfiles;AccountKey=dGF1LT/uPZ+oyq6lJMMAMyrkWazjBRC1G/k3Elirkg8q0pUDGdQ+zAHLEescUbUqFdeYkOu4Kk+r+ASt9YvsFg==;EndpointSuffix=core.windows.net";
                    BlobServiceClient blobServiceClient = new BlobServiceClient(storageConnectionString);

                    // Create a container (if it doesn't exist already)
                    string containerName = "procionfiles";
                    BlobContainerClient containerClient = blobServiceClient.GetBlobContainerClient(containerName);
                    await containerClient.CreateIfNotExistsAsync(PublicAccessType.BlobContainer);

                    // Generate a unique blob name (you can adjust this based on your requirement)
                    string blobName = $"Backups/{Guid.NewGuid()}/{DateTime.Now:yyyyMMdd_HHmmss}.bacpac";

                    // Get a reference to the blob and upload the file
                    BlobClient blobClient = containerClient.GetBlobClient(blobName);
                    await blobClient.UploadAsync(memoryStream, true);

                    // Return the URL of the uploaded blob as the response
                    return Ok(new { url = blobClient.Uri.ToString() });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Failed to create backup.");
            }
        }

        [HttpPost("restore")]
        [DisableRequestSizeLimit]
        public async Task<IActionResult> RestoreDatabase( IFormFile backupFile)
        {
            try
            {
                bool success = await _backupRepository.RestoreDatabase(backupFile);
                return Ok(success);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Failed to restore database: {ex.Message}");
            }
        }
    }
}
