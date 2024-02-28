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
using Azure.Storage.Blobs.Models;
using Azure.Storage.Blobs;

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
            string blobName = $"Help/{HelpName}/{file.FileName}";

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
        [Route("GetHelpPDFFiles/{HelpName}/{filename}")]
        public IActionResult GetHelpPDFFile(string HelpName, string filename)
        {
            // Connect to your Azure Blob Storage account
            string connectionString = "DefaultEndpointsProtocol=https;AccountName=procionfiles;AccountKey=dGF1LT/uPZ+oyq6lJMMAMyrkWazjBRC1G/k3Elirkg8q0pUDGdQ+zAHLEescUbUqFdeYkOu4Kk+r+ASt9YvsFg==;EndpointSuffix=core.windows.net";
            BlobServiceClient blobServiceClient = new BlobServiceClient(connectionString);

            // Specify your container name where the files are stored
            string containerName = "procionfiles";
            BlobContainerClient containerClient = blobServiceClient.GetBlobContainerClient(containerName);

            // Create a reference to the blob within the container
            string blobPath = $"Help/{HelpName}/{filename}";
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

        [HttpGet]
        [Route("GetHelpVideoFiles/{HelpName}/{filename}")]
        public IActionResult GetHelpVideoFile(string HelpName, string filename)
        {
            // Connect to your Azure Blob Storage account
            string connectionString = "DefaultEndpointsProtocol=https;AccountName=procionfiles;AccountKey=dGF1LT/uPZ+oyq6lJMMAMyrkWazjBRC1G/k3Elirkg8q0pUDGdQ+zAHLEescUbUqFdeYkOu4Kk+r+ASt9YvsFg==;EndpointSuffix=core.windows.net";
            BlobServiceClient blobServiceClient = new BlobServiceClient(connectionString);

            // Specify your container name where the files are stored
            string containerName = "procionfiles";
            BlobContainerClient containerClient = blobServiceClient.GetBlobContainerClient(containerName);

            // Create a reference to the blob within the container
            string blobPath = $"Help/{HelpName}/{filename}";
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
            string contentType = "video/mp4"; // You may need to adjust this based on your file types

            // Return the file as a FileResult
            return File(memoryStream, contentType, filename);
        }

        [HttpDelete]
        [Route("DeleteHelpFile/{HelpName}/{fileName}")]
        public async Task<IActionResult> DeleteHelpFile(string HelpName, string fileName)
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
                string blobName = $"Help/{HelpName}/{fileName}";

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
    }
}
