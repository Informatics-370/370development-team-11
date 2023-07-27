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

        [HttpGet]
        [Route("GetProcurementQuotes")]
        public async Task<IActionResult> GetProcurementQuotes()
        {
            try
            {
                var result = await _Procurement_Request_Repository.GetProcurementQuotesAsync();
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpGet]
        [Route("GetProcurementQuotesbyID/{id}")]
        public async Task<IActionResult> GetProcurementQuotesbyID([FromRoute] int id)
        {
            try
            {
                var result = await _Procurement_Request_Repository.GetProcurementQuotesbyIDAsync(id);
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpGet]
        [Route("GetFileByName/{VendorName}/{FileName}")]
        public async Task<IActionResult> GetFileByName([FromRoute] string VendorName, [FromRoute] string FileName)
        {
            try
            {
                var filePath = Path.Combine(Directory.GetCurrentDirectory(), "Files", "ProcurementQuotes", VendorName, FileName);
                if (System.IO.File.Exists(filePath))
                {
                    return Ok(true);
                }

                else
                {
                    return Ok(false);
                }
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
            var RequestID = Request.Form["RequestID"];

            if (file == null || file.Length == 0)
            {
                return BadRequest("No file selected");
            }

            var folderPath = Path.Combine("Files", "ProcurementQuotes", VendorName, RequestID);
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

            var PathSaved = Path.Combine(VendorName,RequestID, file.FileName);
            return Ok(new { PathSaved });
        }

        [HttpGet]
        [Route("GetProcurementQuote/{VendorName}/{RequestID}/{filename}")]
        public IActionResult GetFile(string VendorName,string RequestID, string filename)
        {
            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "Files", "ProcurementQuotes", VendorName, RequestID, filename);
            var fileBytes = System.IO.File.ReadAllBytes(filePath);
            var contentType = "application/pdf";
            return File(fileBytes, contentType, filename);
        }

        [HttpDelete]
        [Route("DeleteRequest/{id}")]
        public async Task<IActionResult> DeleteRequest([FromRoute] int id)
        {
            try
            {
                var result = await _Procurement_Request_Repository.DeleteProcurementRequestAsync(id);
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpGet]
        [Route("GetRequestByID/{id}")]
        public async Task<IActionResult> GetRequestByID([FromRoute] int id)
        {
            try
            {
                var result = await _Procurement_Request_Repository.GetRequestByIDAsync(id);
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpDelete]
        [Route("DeleteFile/{VendorName}/{RequestID}/{fileName}")]
        public IActionResult DeleteFile(string VendorName,string RequestID, string filename)
        {
            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "Files", "ProcurementQuotes", VendorName,RequestID, filename);

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

        [HttpPut]
        [Route("UpdatePRRequest/{id}")]
        public async Task<IActionResult> UpdateConsumable([FromRoute] int id, Procurement_Request Request)
        {
            try
            {
                var result = await _Procurement_Request_Repository.UpdateProcurementRequestAsync(id, Request);
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpPut]
        [Route("UpdateProcurementQuotes/{id}")]
        public async Task<IActionResult> UpdateProcurementQuotes([FromRoute] int id, Procurement_Request_Quote Request)
        {
            try
            {
                var result = await _Procurement_Request_Repository.UpdateProcurementRequestQuouteAsync(id, Request);
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }


    }
}
