using Microsoft.AspNetCore.Mvc;
using ProcionAPI.Models.Repositories;
using Microsoft.SqlServer.Management.Smo;

namespace ProcionAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BackupController : Controller
    {
        private readonly IBackupRepository _backupRepository;
        public BackupController(IBackupRepository BackupRepository)
        {
            _backupRepository = BackupRepository;
        }

        [HttpPost]
        [Route("CreateBackup")]
        public async Task<IActionResult> CreateBackup()
        {
            bool success = await _backupRepository.CreateBackup();

            if (success)
            {
                return Ok("Backup created successfully!");
            }
            else
            {
                return StatusCode(500, "Failed to create backup.");
            }
        }
    }
}
