using Azure.Core;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Net.Http.Headers;
using ProcionAPI.Models.Entities;
using ProcionAPI.Models.Repositories;
using System.Data.SqlTypes;
using System.Net.Mime;

namespace ProcionAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OnboardRequestController : Controller
    {
        private readonly IOnboardRequestRepository _OnboardRequestRepository;
        public OnboardRequestController(IOnboardRequestRepository OnboardRequestRepository)
        {
            _OnboardRequestRepository = OnboardRequestRepository;
        }
        [HttpGet]
        [Route("GetAllOnboardRequest")]
        public async Task<IActionResult> GetAllOnboardRequest()
        {
            try
            {
                var result = await _OnboardRequestRepository.GetAllOnBoardRequestAsync();
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }


        [HttpPost]
        [Route("CreateOnboardRequest")]
        public async Task<IActionResult> CreateOnboardRequest(Onboard_Request RequestAdd)
        {
            try
            {
                var result = await _OnboardRequestRepository.AddRequestAsync(RequestAdd);
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpPost]
        [DisableRequestSizeLimit]
        [Route("uploadFile")]
        public async Task<IActionResult> UploadHandler()
        {
            var formCollection = await Request.ReadFormAsync();
            var file = formCollection.Files.First();

            var RequestNo = Request.Form["RequestNo"].ToString();
           // 
            if (file == null || file.Length == 0)
            {
                return BadRequest("No file selected");
            }

            // Replace "path/to/folder" with the actual folder path
            var folderPath = Path.Combine("Files", "OnboardRequests", RequestNo);
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
            //Path.Combine("OnboardRequests", RequestNo, file.FileName)
            return Ok(new { filePath });
        }

        [HttpPost]
        [DisableRequestSizeLimit]
        [Route("getFile")]
        public async Task<IActionResult> getFileName()
        {
            var sFile = Request.Form["sfile"].ToString();
            var absoluteFolderPath = Path.Combine(Directory.GetCurrentDirectory(), sFile);

            return Ok(new { absoluteFolderPath });
        }

        //redundant
        [HttpGet]
        [Route("GetAllVendor")]
        public async Task<IActionResult> GetAllVendor()
        {
            try
            {
                var result = await _OnboardRequestRepository.GetAllVendorRequestsAsync();
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpPut]
        [Route("EditVendor/{Vendor_ID}")]
        public async Task<ActionResult> EditVendor([FromRoute] int Vendor_ID, Vendor EditVendorRequest)
        {
            var results = await _OnboardRequestRepository.EditVendorAsync(Vendor_ID, EditVendorRequest);
            return Ok(results);
        }

        [HttpGet]
        [Route("GetRequest/{RequestID}")]
        public async Task<IActionResult> GetRequests(int RequestID)
        {
            try
            {
                var result = await _OnboardRequestRepository.GetRequestsAsync(RequestID);
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }
            
        [HttpGet]
        [Route("GetFileST/{sFi}/{sOR}/{sRS}/{filename}")]
        public IActionResult GetFile(string sFi, string sOR , string sRS, string filename)
        {
            var filePath = Path.Combine(Directory.GetCurrentDirectory(),sFi,sOR,sRS,filename);
            var fileBytes = System.IO.File.ReadAllBytes(filePath);
            var contentType = "application/octet-stream";
            return File(fileBytes, contentType, filename);
        }


        [HttpPut]
        [Route("UpdateOnboardRequest/{RequestID}/{VendorID}")]
        public async Task<ActionResult> EditRequest(int RequestID,int VendorID, Onboard_Request UpdatedRequest)
        {
            var results = await _OnboardRequestRepository.EditRequestAsync(RequestID, VendorID, UpdatedRequest);
            return Ok(results);
        }


        [HttpDelete]
        [Route("DeleteFile/{RequestNo}/{fileName}")]
        public IActionResult DeleteFile(string RequestNo, string fileName)
        {

            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "Files", "OnboardRequests",RequestNo, fileName);

            try
            {
                if (System.IO.File.Exists(filePath))
                {
                    System.IO.File.Delete(filePath);
                    return Ok($"File {fileName} deleted successfully");
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


        [HttpDelete]
        [Route("DeleteRequest/{RequestId}/{VendorID}")]
        public async Task<IActionResult> DeleteConsumable(int RequestId,int VendorID)
        {
            try
            {
                var result = await _OnboardRequestRepository.DeleteRequestAsync(RequestId, VendorID);
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }
    }
    
}
