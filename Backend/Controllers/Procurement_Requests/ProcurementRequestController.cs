using Microsoft.AspNetCore.Mvc;
using ProcionAPI.Models.Entities;
using ProcionAPI.Models.Repositories.Procurement_Requests;

namespace ProcionAPI.Controllers.Procurement_Requests
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProcurementRequestController : Controller
    {
        private readonly IProcurement_Request_Repository _Procurement_Request_Repository;

        public ProcurementRequestController(IProcurement_Request_Repository ProcurementRequestRepository)
        {
            _Procurement_Request_Repository = ProcurementRequestRepository;
        }
        [HttpGet]
        [Route("GetProcurementRequests")]
        public async Task<IActionResult> GetProcurementRequests()
        {
            try
            {
                var result = await _Procurement_Request_Repository.GetProcurementRequestsAsync();
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpPost]
        [Route("CreateProcurementRequest")]
        public async Task<IActionResult> CreateProcurementRequest([FromBody] Procurement_Request RequestAdd)
        {
            try
            {
                var result = await _Procurement_Request_Repository.AddProcurementRequestAsync(RequestAdd);
                return Ok(result);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpPost]
        [Route("CreateProcurementQuote")]
        public async Task<IActionResult> CreateProcurementQuote([FromBody] Procurement_Request_Quote RequestAdd)
        {
            try
            {
                var result = await _Procurement_Request_Repository.CreateProcurementQuoteAsync(RequestAdd);
                return Ok(result);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message.ToString());
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpPost]
        [DisableRequestSizeLimit]
        [Route("uploadProcurementQuote")]
        public async Task<IActionResult> UploadHandler()
        {
            var formCollection = await Request.ReadFormAsync();

            var file = formCollection.Files.First();


            var VendorName = Request.Form["VendorName"];

            if (file == null || file.Length == 0)
            {
                return BadRequest("No file selected");
            }

            var folderPath = Path.Combine("Files", "ProcurementQuotes", VendorName);
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

            var PathSaved = Path.Combine(VendorName, file.FileName);
            return Ok(new { PathSaved });
        }
    }
}
