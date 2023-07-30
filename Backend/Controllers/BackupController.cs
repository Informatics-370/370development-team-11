using Microsoft.AspNetCore.Mvc;
using ProcionAPI.Models.Repositories;
using Microsoft.SqlServer.Management.Smo;
using MailKit;

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
            try
            {
                bool success = await _backupRepository.CreateBackup();

                if (success)
                {
                    return Ok(success);
                }
                else
                {

                    return StatusCode(500, "Failed to create backup.");
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("restore")]
        [DisableRequestSizeLimit]
        public async Task<IActionResult> RestoreDatabase( IFormFile backupFile)
        {
            try
            {
                bool success = await _backupRepository.RestoreDatabase(backupFile);
                if (success)
                {
                    return Ok(success);
                }
                else
                {
                    return StatusCode(500, "Failed to restore database.");
                }
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Failed to restore database: {ex.Message}");
            }
        }
        //   [HttpPost("restore")]
        //public async Task<IActionResult> RestoreDatabase([FromForm] IFormFile backupFile)
        //{
        //    try
        //    {
        //        bool success = await _backupRepository.RestoreDatabase(backupFile);
        //        if (success)
        //        {
        //            return Ok("Database restored successfully!");
        //        }
        //        else
        //        {
        //            return StatusCode(500, "Failed to restore database.");
        //        }
        //    }
        //    catch (ArgumentException ex)
        //    {
        //        return BadRequest(ex.Message);
        //    }
        //    catch (Exception ex)
        //    {
        //        return StatusCode(500, $"Failed to restore database: {ex.Message}");
        //    }
        //}

        //[HttpPost("restore")]
        //public IActionResult RestoreDatabase([FromForm] string backupFilePath)
        //{
        //    try
        //    {
        //        if (string.IsNullOrEmpty(backupFilePath))
        //        {
        //            return BadRequest("Please select a backup file to restore the database.");
        //        }

        //        _backupRepository.RestoreDatabase(backupFilePath);

        //        return Ok("Database restored successfully!");
        //    }
        //    catch (Exception ex)
        //    {
        //        return StatusCode(500, $"Failed to restore database: {ex.Message}");
        //    }
        //}

        //[HttpPost]
        //[DisableRequestSizeLimit]
        //[Route("uploadBackupFile")]
        //public async Task<IActionResult> CreateBackup()
        //{

        //    var formCollection = await Request.ReadFormAsync();
        //    var file = formCollection.Files.First();


        //    var HelpName = Request.Form["HelpName"];
        //    // 
        //    if (file == null || file.Length == 0)
        //    {
        //        return BadRequest("No file selected");
        //    }

        //    // Replace "path/to/folder" with the actual folder path
        //    var folderPath = Path.Combine("Files", "Help", HelpName);
        //    var filePath = Path.Combine(folderPath, file.FileName);
        //    var absoluteFolderPath = Path.Combine(Directory.GetCurrentDirectory(), folderPath);
        //    if (!Directory.Exists(absoluteFolderPath))
        //    {
        //        Directory.CreateDirectory(absoluteFolderPath);
        //    }

        //    using (var stream = new FileStream(filePath, FileMode.Create))
        //    {
        //        await file.CopyToAsync(stream);
        //    }
        //    var PathSaved = Path.Combine(HelpName, file.FileName);
        //    return Ok(new { PathSaved });
        //}
    }
}
