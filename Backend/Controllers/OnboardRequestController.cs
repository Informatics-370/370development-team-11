using Microsoft.AspNetCore.Mvc;
using Microsoft.Net.Http.Headers;
using ProcionAPI.Models.Entities;
using ProcionAPI.Models.Repositories;
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
        [Route("EditVendor{Vendor_ID}")]
        public async Task<ActionResult> EditVendor([FromRoute] int Vendor_ID, Vendor EditVendorRequest)
        {
            var results = await _OnboardRequestRepository.EditVendorAsync(Vendor_ID, EditVendorRequest);
            return Ok(results);
        }

        [HttpGet]
        [Route("GetRequest{Request_ID}")]
        public async Task<IActionResult> GetAllRequests()
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
    }
}
