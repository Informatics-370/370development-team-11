using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using ProcionAPI.Models.Entities;
using ProcionAPI.Models.Repositories;
using ProcionAPI.Data;
using Microsoft.AspNetCore.Cors;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Net.Http.Headers;

namespace ProcionAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DelegationController : Controller
    {
        public readonly IDelegationRepository _DelegationRepository;

        public DelegationController(IDelegationRepository DelegationRepository)
        {
            _DelegationRepository = DelegationRepository;
        }

        [HttpGet]
        [Route("GetDelegations")]
        public async Task<IActionResult> GetAllDelegations()
        {
            try
            {
                var result = await _DelegationRepository.GetAllDelegationsAsync();
                return Ok(result);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpGet]
        [Route("GetDelegationsByRole")]
        public async Task<IActionResult> GetAllDelegationsByRole()
        {
            try
            {
                var result = await _DelegationRepository.GetAllDelegationsByRoleAsync();
                return Ok(result);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpGet]
        [Route("GetActiveDelegations")]
        public async Task<IActionResult> GetAllActiveDelegations()
        {
            try
            {
                var result = await _DelegationRepository.GetAllActiveDelegationsAsync();
                return Ok(result);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpPost]
        [DisableRequestSizeLimit]
        [Route("uploadDelegationFile")]
        public async Task<IActionResult> UploadHandler()
        {
            var formCollection = await Request.ReadFormAsync();
            var file = formCollection.Files.First();

            
            var DelegateName = Request.Form["DelegateName"];

            if(file == null || file.Length == 0)
            {
                return BadRequest("No file selected");
            }

            var folderPath = Path.Combine("Files", "AuthorityDelegations", DelegateName);
            var filePath = Path.Combine(folderPath, file.FileName);
            var absoluteFolderPath = Path.Combine(Directory.GetCurrentDirectory(), folderPath);

            if (!Directory.Exists(absoluteFolderPath))
            {
                Directory.CreateDirectory(absoluteFolderPath);
            }

            using(var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }
            
            var PathSaved = Path.Combine(DelegateName, file.FileName);
            return Ok(new {PathSaved });
        }

        [HttpPost]
        [Route("CreateDelegation")]
        public async Task<IActionResult> CreateDelegation(Delegation_Of_Authority DelegationAdd)
        {
            try
            {
                var result = await _DelegationRepository.AddDelegationAsync(DelegationAdd);
                return Ok(result);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpGet]
        [Route("GetDelegationFiles/{DelegateName}/{filename}")]
        public IActionResult GetFile(string DelegateName, string filename)
        {
            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "Files", "AuthorityDelegations", DelegateName, filename);
            var fileBytes = System.IO.File.ReadAllBytes(filePath);
            var contentType = "application/pdf";
            return File(fileBytes, contentType, filename);
        }

        [HttpGet]
        [Route("GetDelegation/{delegationID}")]
        public async Task<IActionResult> GetDelegationAsync(int delegationID)
        {
            try
            {
                var result = await _DelegationRepository.GetDelegationAsync(delegationID);
                if (result == null) return NotFound("Delegation does not exist. You need to create it first");

                return Ok(result);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support");
            }
        }

        [HttpDelete]
        [Route("DeleteFile/{DelegateName}/{fileName}")]
        public IActionResult DeleteFile(string DelegateName, string filename)
        {
            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "Files", "AuthorityDelegations", DelegateName, filename);

            try
            {
                if (System.IO.File.Exists(filePath))
                {
                    System.IO.File.Delete(filePath);
                    return Ok(new { filename });
                }
                else
                {
                    return NotFound($"File {filename} not found");
                }
            }
            catch (IOException ex)
            {
                return StatusCode(500, $"Error deleting file: {ex.Message}");
            }
        }

        [HttpDelete]
        [Route("DeleteDelegation/{delegationID}")]
        public async Task<IActionResult> DeleteDelegation(int delegationID)
        {
            try
            {
                var existingDOA = await _DelegationRepository.GetDelegationAsync(delegationID);
                if (existingDOA == null) return NotFound($"The delegation request does not exist");
                Console.WriteLine("poes");
                Console.WriteLine(existingDOA);

                _DelegationRepository.Delete(existingDOA);
                if (await _DelegationRepository.SaveChangesAsync()) return Ok(existingDOA);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
            return BadRequest("Your request is invalid");
        }

        [HttpDelete]
        [Route("DeleteTempAcc/{delegationID}")]
        public async Task<IActionResult> DeleteTempAcc(int delegationID)
        {
            try
            {
                var existingTempAcc = await _DelegationRepository.GetTempAccAsync(delegationID);
                if (existingTempAcc == null) return NotFound($"The temporary access does not exist");

                _DelegationRepository.Delete(existingTempAcc);
                if (await _DelegationRepository.SaveChangesAsync()) return Ok(existingTempAcc);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
            return BadRequest("Your request is invalid");
        }

        [HttpPut]
        [Route("EditDelegation/{delegationID}")]
        public async Task<ActionResult> EditDelegation(Delegation_Of_Authority DelegationUpdate, [FromRoute] int delegationID)
        {
            try
            {
                var result = await _DelegationRepository.UpdateDelegationAsync(DelegationUpdate, delegationID);
                return Ok(result);
            }
            catch
            {
                return StatusCode(500, "Internal Server Error. Please contact support");
            }
        }

        [HttpPut]
        [Route("EditDelegationStatus/{statusID}/{delegationID}")]
        public async Task<ActionResult> EditDelegationStatus([FromRoute] int statusID, [FromRoute] int delegationID)
        {
            try
            {
                var result = await _DelegationRepository.UpdateDelegationStatusAsync(statusID, delegationID);
                return Ok(result);
            }
            catch
            {
                return StatusCode(500, "Internal Server Error. Please contact support");
            }
        }

        [HttpGet]
        [Route("GetRejStatuses")]
        public async Task<IActionResult> GetAllRejStatuses()
        {
            try
            {
                var result = await _DelegationRepository.GetAllRejStatusesAsync();
                return Ok(result);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpPost]
        [Route("AddTempAcc")]
        public async Task<IActionResult> AddTempAcc(Temporary_Access TempAccAdd)
        {
            try
            {
                var result = await _DelegationRepository.AddTempAccAsync(TempAccAdd);
                return Ok(result);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpGet]
        [Route("GetTempAcc/{delegationID}")]
        public async Task<IActionResult> GetTempAcc(int delegationID)
        {
            try
            {
                var result = await _DelegationRepository.GetTempAccAsync(delegationID);
                if (result == null) return NotFound("Delegation does not exist. You need to create it first");

                return Ok(result);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support");
            }
        }
    }
}
