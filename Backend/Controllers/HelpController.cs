using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using ProcionAPI.Models.Entities;
using ProcionAPI.Models.Repositories;
using ProcionAPI.Data;
using Microsoft.AspNetCore.Cors;
using Azure.Core;
using Microsoft.Net.Http.Headers;
using System.Data.SqlTypes;
using System.Net.Mime;

namespace ProcionAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HelpController : Controller
    {

        private readonly IHelpRepository _helpRepository;
        public HelpController(IHelpRepository HelpRepository)
        {
            _helpRepository = HelpRepository;
        }

        [HttpGet]
        [Route("GetHelps")]
        public async Task<IActionResult> GetAllHelps()
        {
            try
            {
                var result = await _helpRepository.GetAllHelpsAsync();
                return Ok(result);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }
        [HttpGet]
        [Route("GetHelpCategorys")]
        public async Task<IActionResult> GetAllHelpCategorys()
        {
            try
            {
                var result = await _helpRepository.GetAllHelpCategorysAsync();
                return Ok(result);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpPost]
        [Route("CreateHelp")]
        public async Task<IActionResult> AddHelp(HELP AddHelp)
        {
            try
            {
               
                var result = await _helpRepository.AddHelpAsync(AddHelp);
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpPut]
        [Route("EditHelp/{Help_ID}")]
        public async Task<ActionResult<HELP>> EditHelp(HELP EditHelpRequest, [FromRoute] int Help_ID)
        {
            try
            {
                var result = await _helpRepository.UpdateHelpAsync(EditHelpRequest, Help_ID);
                return Ok(result);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support");
            }
            
        }

        [HttpDelete]
        [Route("DeleteHelp/{Help_ID}")]
        public async Task<IActionResult> DeleteHelp(int Help_ID)
        {
            try
            {
                var existingHelp = await _helpRepository.GetHelpAsync(Help_ID);
                if (existingHelp == null) return NotFound($"The role does not exist");
                _helpRepository.Delete(existingHelp);
                if (await _helpRepository.SaveChangesAsync()) return Ok(existingHelp);
            }
            catch
            {
                return StatusCode(500, "Internal Server Error. Please contact support");
            }
            return BadRequest("Your request is invalid");
        }


        [HttpGet]
        [Route("GetHelp/{Help_ID}")]
        public async Task<IActionResult> GetHelp(int Help_ID)
        {
            try
            {
                var result = await _helpRepository.GetHelpAsync(Help_ID);
                if (result == null) return NotFound("Help does not exist. You need to create it first");

                return Ok(result);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support");
            }
        }

        [HttpGet]
        [Route("HelpValidation/{name}")]
        public async Task<IActionResult> HelpValidation([FromRoute] string name)
        {
            try
            {
                var result = await _helpRepository.HelpValidationAsync(name);
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpGet]
        [Route("EditHelpValidation/{name}/{id}")]
        public async Task<IActionResult> EditHelpValidation([FromRoute] string name, int id)
        {
            try
            {
                var result = await _helpRepository.EditHelpValidationAsync(name, id);
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }



        [HttpPost]
        [DisableRequestSizeLimit]
        [Route("uploadHelpFile")]
        public async Task<IActionResult> UploadHelpHandler()
        {

            var formCollection = await Request.ReadFormAsync();
            var file = formCollection.Files.First();


            var HelpName = Request.Form["HelpName"];
            // 
            if (file == null || file.Length == 0)
            {
                return BadRequest("No file selected");
            }

            // Replace "path/to/folder" with the actual folder path
            var folderPath = Path.Combine("Files", "Help", HelpName);
            var filePath = Path.Combine(folderPath, file.FileName);
            var absoluteFolderPath = Path.Combine(Directory.GetCurrentDirectory(), folderPath);
            if (!Directory.Exists(absoluteFolderPath))
            {
                Directory.CreateDirectory(absoluteFolderPath);
            }

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }
            var PathSaved = Path.Combine(HelpName, file.FileName);
            return Ok(new { PathSaved });
        }

        [HttpGet]
        [Route("GetHelpPDFFiles/{HelpName}/{filename}")]
        public IActionResult GetHelpPDFFile(string HelpName, string filename)
        {
            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "Files", "Help", HelpName, filename);
            var fileBytes = System.IO.File.ReadAllBytes(filePath);
            var contentType = "application/pdf";
            return File(fileBytes, contentType, filename);
        }

        [HttpGet]
        [Route("GetHelpVideoFiles/{HelpName}/{filename}")]
        public IActionResult GetHelpVideoFile(string HelpName, string filename)
        {
            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "Files", "Help", HelpName, filename);
            var fileBytes = System.IO.File.ReadAllBytes(filePath);
            var contentType = "video/mp4";
            return File(fileBytes, contentType, filename);
        }

        [HttpDelete]
        [Route("DeleteHelpFile/{HelpName}/{fileName}")]
        public IActionResult DeleteHelpFile(string HelpName, string fileName)
        {

            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "Files", "Help", HelpName, fileName);

            try
            {
                if (System.IO.File.Exists(filePath))
                {
                    System.IO.File.Delete(filePath);
                    return Ok(new {fileName});
                }
                else
                {
                    return NotFound($"File {fileName} not found");
                }
            }
            catch (IOException ex)
            {
                return StatusCode(500, $"Error deleting file: {ex.Message}");
            }
        }
    }
}
