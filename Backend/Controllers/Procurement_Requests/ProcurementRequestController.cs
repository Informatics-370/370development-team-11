using Microsoft.AspNetCore.Mvc;
using ProcionAPI.Models.Entities;
using ProcionAPI.Models.Repositories.Procurement_Requests;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;

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
        [Route("GetProcurementRequestsPerUser/{Username}")]
        public async Task<IActionResult> GetProcurementRequestsPerUser([FromRoute] string Username)
        {
            try
            {
                var result = await _Procurement_Request_Repository.GetProcurementRequestsForUserAsync(Username);
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



            // Connect to your Azure Blob Storage account
            string connectionString = "DefaultEndpointsProtocol=https;AccountName=procionfiles;AccountKey=dGF1LT/uPZ+oyq6lJMMAMyrkWazjBRC1G/k3Elirkg8q0pUDGdQ+zAHLEescUbUqFdeYkOu4Kk+r+ASt9YvsFg==;EndpointSuffix=core.windows.net";
            BlobServiceClient blobServiceClient = new BlobServiceClient(connectionString);

            // Create a container (if it doesn't exist already)
            string containerName = "procionfiles";
            BlobContainerClient containerClient = blobServiceClient.GetBlobContainerClient(containerName);
            await containerClient.CreateIfNotExistsAsync(PublicAccessType.BlobContainer);

            // Create a unique blob name (you can adjust this based on your requirement)
            string blobName = $"{VendorName}/{RequestID}/{file.FileName}";

            // Get a reference to the blob and upload the file
            BlobClient blobClient = containerClient.GetBlobClient(blobName);
            using (Stream stream = file.OpenReadStream())
            {
                await blobClient.UploadAsync(stream, true);
            }

            // Return the URL of the uploaded blob as the response
            return Ok(new { url = blobClient.Uri.ToString() });
        }

        [HttpGet]
        [Route("GetProcurementQuote/{VendorName}/{RequestID}/{filename}")]
        public IActionResult GetFile(string VendorName, string RequestID, string filename)
        {
            // Connect to your Azure Blob Storage account
            string connectionString = "DefaultEndpointsProtocol=https;AccountName=procionfiles;AccountKey=dGF1LT/uPZ+oyq6lJMMAMyrkWazjBRC1G/k3Elirkg8q0pUDGdQ+zAHLEescUbUqFdeYkOu4Kk+r+ASt9YvsFg==;EndpointSuffix=core.windows.net";
            BlobServiceClient blobServiceClient = new BlobServiceClient(connectionString);

            // Specify your container name where the files are stored
            string containerName = "procionfiles";
            BlobContainerClient containerClient = blobServiceClient.GetBlobContainerClient(containerName);

            // Create a reference to the blob within the container
            string blobPath = $"{VendorName}/{RequestID}/{filename}";
            BlobClient blobClient = containerClient.GetBlobClient(blobPath);

            // Check if the blob exists
            if (!blobClient.Exists())
            {
                // Return an error response if the blob does not exist
                return NotFound();
            }

            // Download the blob content into a MemoryStream
            MemoryStream memoryStream = new MemoryStream();
            blobClient.DownloadTo(memoryStream);
            memoryStream.Position = 0;

            // Determine the content type based on the file extension (e.g., application/pdf for PDF files)
            string contentType = "application/pdf"; // You may need to adjust this based on your file types

            // Return the file as a FileResult
            return File(memoryStream, contentType, filename);
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
        public async Task<IActionResult> DeleteFile(string VendorName, string RequestID, string fileName)
        {
            try
            {
                // Connect to your Azure Blob Storage account
                string connectionString = "DefaultEndpointsProtocol=https;AccountName=procionfiles;AccountKey=dGF1LT/uPZ+oyq6lJMMAMyrkWazjBRC1G/k3Elirkg8q0pUDGdQ+zAHLEescUbUqFdeYkOu4Kk+r+ASt9YvsFg==;EndpointSuffix=core.windows.net";
                BlobServiceClient blobServiceClient = new BlobServiceClient(connectionString);

                // Create a container (if it doesn't exist already)
                string containerName = "procionfiles";
                BlobContainerClient containerClient = blobServiceClient.GetBlobContainerClient(containerName);

                // Create a unique blob name based on the given parameters
                string blobName = $"{VendorName}/{RequestID}/{fileName}";

                // Get a reference to the blob and delete it
                BlobClient blobClient = containerClient.GetBlobClient(blobName);

                if (await blobClient.ExistsAsync())
                {
                    await blobClient.DeleteAsync();
                    return Ok(new { fileName });
                }
                else
                {
                    return NotFound($"File {fileName} not found");
                }
            }
            catch (Exception ex)
            {
                return NotFound($"File {fileName} not found");
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

        [HttpPost]
        [Route("ProcurementAddNotification")]
        public async Task<IActionResult> ProcurementAddNotification(Notification ProcurementNotif)
        {
            try
            {
                var result = await _Procurement_Request_Repository.AddNotificationAsync(ProcurementNotif);
                return Ok(result);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }
        [HttpGet]
        [Route("ValidatePRRequestDelete/{id}")]
        public async Task<IActionResult> ValidatePRRequestDelete([FromRoute] int id)
        {
            try
            {
                var result = await _Procurement_Request_Repository.ValidatePRRequestDeleteAsync(id);
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }


    }
}
