
using Azure.Storage.Blobs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Net.Http.Headers;

using ProcionAPI.Models.Entities;
using ProcionAPI.Models.Repositories;
using System.Data.SqlTypes;
using System.Net;
using System.Net.Mime;
using Azure.Storage.Blobs.Models;

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
        [Route("uploadOnboardFile")]
        public async Task<IActionResult> UploadHandler()
        {

            var formCollection = await Request.ReadFormAsync();
            var file = formCollection.Files.First();


            var RequestNo = Request.Form["RequestNo"];
            // 
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
            string blobName = $"OnboardRequests/{RequestNo}/{file.FileName}";

            // Get a reference to the blob and upload the file
            BlobClient blobClient = containerClient.GetBlobClient(blobName);
            using (Stream stream = file.OpenReadStream())
            {
                await blobClient.UploadAsync(stream, true);
            }

            // Return the URL of the uploaded blob as the response
            return Ok(new { url = blobClient.Uri.ToString() });
        }

        //[HttpPost]
        //[DisableRequestSizeLimit]
        //[Route("getFile")]
        //public async Task<IActionResult> getFileName()
        //{
        //    var sFile = Request.Form["sfile"].ToString();
        //    var absoluteFolderPath = Path.Combine(Directory.GetCurrentDirectory(), sFile);

        //    return Ok(new { absoluteFolderPath });
        //}

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

        [HttpGet]
        [Route("GetVendorValidation/{sVendorName}")]
        public async Task<ActionResult> EditVendor(string sVendorName)
        {
            var results = await _OnboardRequestRepository.GetVendorValidationAsync(sVendorName);
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
        [Route("GetOnboardFiles/{RequestNo}/{filename}")]
        public IActionResult GetFile(string RequestNo, string filename)
        {
            // Connect to your Azure Blob Storage account
            string connectionString = "DefaultEndpointsProtocol=https;AccountName=procionfiles;AccountKey=dGF1LT/uPZ+oyq6lJMMAMyrkWazjBRC1G/k3Elirkg8q0pUDGdQ+zAHLEescUbUqFdeYkOu4Kk+r+ASt9YvsFg==;EndpointSuffix=core.windows.net";
            BlobServiceClient blobServiceClient = new BlobServiceClient(connectionString);

            // Specify your container name where the files are stored
            string containerName = "procionfiles";
            BlobContainerClient containerClient = blobServiceClient.GetBlobContainerClient(containerName);

            // Create a reference to the blob within the container
            string blobPath = $"OnboardRequests/{RequestNo}/{filename}";
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
            var contentType = "application/octet-stream";// You may need to adjust this based on your file types
            if (filename.Contains(".pdf"))
            {
                contentType = "application/pdf";
            }

            // Return the file as a FileResult
            return File(memoryStream, contentType, filename);
        }



        [HttpPut]
        [Route("UpdateOnboardRequest/{RequestID}")]
        public async Task<ActionResult> EditRequest(int RequestID, Onboard_Request UpdatedRequest)
        {
            try
            {
                var results = await _OnboardRequestRepository.EditRequestAsync(RequestID, UpdatedRequest);
                return Ok(results);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }
        //,int VendorID , VendorID /{VendorID}

        [HttpDelete]
        [Route("DeleteFile/{RequestNo}/{fileName}")]
        public async Task<IActionResult> DeleteFile(string RequestNo, string fileName)
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
                string blobName = $"OnboardRequests/{RequestNo}/{fileName}";

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


        [HttpDelete]
        [Route("DeleteRequest/{RequestId}/{VendorID}")]
        public async Task<IActionResult> DeleteRequest(int RequestId,int VendorID)
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

        [HttpPost]
        [Route("AddSoleSupplierDetails/{VendorID}")]
        public async Task<IActionResult> AddSoleSupplierDetails(int VendorID,Sole_Supplier soleSupplier)
        {
            try
            {
                var result = await _OnboardRequestRepository.AddSoleSupplierDetailsAsync(VendorID,soleSupplier);
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpGet]
        [Route("GetSoleSupplierByID/{VendorID}")]
        public async Task<IActionResult> GetSoleSupplierByID(int VendorID)
        {
            try
            {
                var result = await _OnboardRequestRepository.GetSoleSupplierByIDAsync(VendorID);
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpPut]
        [Route("UpdateSoleSupplier/{SoleSupplierID}")]
        public async Task<ActionResult> UpdateSoleSupplier([FromRoute]  int SoleSupplierID, Sole_Supplier UpdatedSoleSupplier)
        {
            var results = await _OnboardRequestRepository.UpdateSoleSupplierAsync(SoleSupplierID, UpdatedSoleSupplier);
            return Ok(results);
        }

        [HttpDelete]
        [Route("DeleteSoleSupplier/{VendorID}")]
        public async Task<ActionResult> DeleteSoleSupplier(int VendorID)
        {
            var results = await _OnboardRequestRepository.DeleteSoleSupplierAsync(VendorID);
            return Ok(results);
        }

        [HttpDelete]
        [Route("DeleteVendor/{VendorID}")]
        public async Task<ActionResult> DeleteVendor(int VendorID)
        {
            var results = await _OnboardRequestRepository.DeleteVendorAsync(VendorID);
            return Ok(results);
        }

        [HttpGet]
        [Route("GetAllApprovedVendor")]
        public async Task<IActionResult> GetAllApprovedVendor()
        {
            try
            {
                var result = await _OnboardRequestRepository.GetAllApprovedVendorRequestsAsync();
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }
    }
    
}
