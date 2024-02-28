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
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;

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
            string blobName = $"AuthorityDelegations/{DelegateName}/{file.FileName}";

            // Get a reference to the blob and upload the file
            BlobClient blobClient = containerClient.GetBlobClient(blobName);
            using (Stream stream = file.OpenReadStream())
            {
                await blobClient.UploadAsync(stream, true);
            }

            // Return the URL of the uploaded blob as the response
            return Ok(new { url = blobClient.Uri.ToString() });
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
            // Connect to your Azure Blob Storage account
            string connectionString = "DefaultEndpointsProtocol=https;AccountName=procionfiles;AccountKey=dGF1LT/uPZ+oyq6lJMMAMyrkWazjBRC1G/k3Elirkg8q0pUDGdQ+zAHLEescUbUqFdeYkOu4Kk+r+ASt9YvsFg==;EndpointSuffix=core.windows.net";
            BlobServiceClient blobServiceClient = new BlobServiceClient(connectionString);

            // Specify your container name where the files are stored
            string containerName = "procionfiles";
            BlobContainerClient containerClient = blobServiceClient.GetBlobContainerClient(containerName);

            // Create a reference to the blob within the container
            string blobPath = $"AuthorityDelegations/{DelegateName}/{filename}";
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
        public async Task<IActionResult> DeleteFile(string DelegateName, string filename)
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
                string blobName = $"AuthorityDelegations/{DelegateName}/{filename}";

                // Get a reference to the blob and delete it
                BlobClient blobClient = containerClient.GetBlobClient(blobName);

                if (await blobClient.ExistsAsync())
                {
                    await blobClient.DeleteAsync();
                    return Ok(new { filename });
                }
                else
                {
                    return NotFound($"File {filename} not found");
                }
            }
            catch (Exception ex)
            {
                return NotFound($"File {filename} not found");
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

        [HttpGet]
        [Route("GetRevokeStatus")]
        public async Task<IActionResult> GetRevokeStatus()
        {
            try
            {
                var result = await _DelegationRepository.GetRevokeStatusAsync();
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

        [HttpGet]
        [Route("GetLoginTempAcc/{delegationID}")]
        public async Task<IActionResult> GetLoginTempAcc(int delegationID)
        {
            try
            {
                var result = await _DelegationRepository.GetLoginTempAccAsync(delegationID);
                if (result == null) return NotFound("Delegation does not exist. You need to create it first");

                return Ok(result);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support");
            }
        }

        [HttpPut]
        [Route("EditTempAcc/{tempAccID}")]
        public async Task<ActionResult> EditTempAcc(Temporary_Access UpdatedTempAcc,[FromRoute] int tempAccID)
        {
            try
            {
                var result = await _DelegationRepository.UpdateTempAccAsync(UpdatedTempAcc, tempAccID);
                return Ok(result);
            }
            catch
            {
                return StatusCode(500, "Internal Server Error. Please contact support");
            }
        }

        [HttpGet]
        [Route("CreateDelegationValidation/{name}")]
        public async Task<IActionResult> CreateDelegationValidation([FromRoute] string name)
        {
            try
            {
                var result = await _DelegationRepository.CreateDelegationValidationAsync(name);
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpGet]
        [Route("EditDelegationValidation/{name}")]
        public async Task<IActionResult> EditDelegationValidation([FromRoute] string name)
        {
            try
            {
                var result = await _DelegationRepository.EditDelegationValidationAsync(name);
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }
    }
}
