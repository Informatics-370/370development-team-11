using Microsoft.AspNetCore.Mvc;
using ProcionAPI.Models.Entities;
using ProcionAPI.Models.Repositories.Procurement_Requests;


namespace ProcionAPI.Controllers.Procurement_Requests
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProcurementDetailsController : Controller
    {
        private readonly IProcurementDetailsRepository _ProcurementDetailsRepository;

        public ProcurementDetailsController(IProcurementDetailsRepository ProcurementDetailsRepository)
        {
            _ProcurementDetailsRepository = ProcurementDetailsRepository;
        }

        [HttpGet]
        [Route("GetProcurementRequestByID/{ProcurementRequestID}")]
        public async Task<IActionResult> GetProcurementRequestByID(int ProcurementRequestID)
        {
            try
            {
                var result = await _ProcurementDetailsRepository.GetProcurementRequestByIDAsync(ProcurementRequestID);
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpGet]
        [Route("GetProcurementRequestQuoteByID/{ProcurementRequestID}")]
        public async Task<IActionResult> GetProcurementRequestQuoteByID(int ProcurementRequestID)
        {
            try
            {
                var result = await _ProcurementDetailsRepository.GetProcurementRequestQuoteByIDAsync(ProcurementRequestID);
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpPost]
        [Route("AddProcurementDetails")]
        public async Task<IActionResult> CreateProcurementDetails(Procurement_Details ProcurementDetails)
        {
            try
            {
                var result = await _ProcurementDetailsRepository.CreateProcurementDetailsAsync(ProcurementDetails);
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpPost]
        [Route("AddDeposit")]
        public async Task<IActionResult> AddDeposit(Deposit DepositDetails)
        {
            try
            {
                var results = await _ProcurementDetailsRepository.AddDepositAsync(DepositDetails);
                return Ok(results);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpPost]
        [Route("AddPaymentMade")]
        public async Task<IActionResult> AddPaymentMade(Payment_Made AddPaymentMade)
        {
            try
            {
                var results = await _ProcurementDetailsRepository.AddPaymentMadeAsync(AddPaymentMade);
                return Ok(results);
            }
            catch(Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpPost]
        [Route("AddProofOfPayment")]
        public async Task<IActionResult> AddProofOfPayment(Proof_Of_Payment AddPOP)
        {
            try
            {
                var results = await _ProcurementDetailsRepository.AddProofOfPaymentAsync(AddPOP);
                return Ok(results);
            }
            catch(Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpPost]
        [Route("AddProcurementConsumable")]
        public async Task<IActionResult> AddProcurementConsumable(Procurement_Consumable AddProcurementConsumable)
        {
            try
            {
                var results = await _ProcurementDetailsRepository.AddProcurementConsumableAsync(AddProcurementConsumable);
                return Ok(results);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpPost]
        [Route("AddVendorConsumable")]
        public async Task<IActionResult> AddVendorConsumable(Vendor_Consumable AddVendorConsumable)
        {
            try
            {
                var results = await _ProcurementDetailsRepository.AddVendorConsumableAsync(AddVendorConsumable);
                return Ok(results);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpPost]
        [Route("AddAsset")]
        public async Task<IActionResult> AddAsset(Asset AddAsset)
        {
            try
            {
                var results = await _ProcurementDetailsRepository.AddAssetAsync(AddAsset);
                return Ok(results);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpPost]
        [Route("AddProcurementAsset")]
        public async Task<IActionResult> AddProcurementAsset(Procurement_Asset AddProcurementAsset)
        {
            try
            {
                var results = await _ProcurementDetailsRepository.AddProcurementAssetAsync(AddProcurementAsset);
                return Ok(results);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpPost]
        [Route("AddVendorAsset")]
        public async Task<IActionResult> AddVendorAsset(Vendor_Asset AddVendorAsset)
        {
            try
            {
                var results = await _ProcurementDetailsRepository.AddVendorAssetAsync(AddVendorAsset);
                return Ok(results);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpGet]
        [Route("GetProcureFiles/{FolderCategory}/{ProcurementID}/{fileName}")]
        public IActionResult GetProcureFiles(string FolderCategory, string ProcurementID, string fileName)
        {
            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "Files", "Procurement", FolderCategory, ProcurementID, fileName);
            var fileBytes = System.IO.File.ReadAllBytes(filePath);
            var contentType = "application/octet-stream";
            if (fileName.Contains(".pdf"))
            {
                contentType = "application/pdf";
            }

            return File(fileBytes, contentType, fileName);
        }

        [HttpPost]
        [DisableRequestSizeLimit]
        [Route("uploadProcureFile")]
        public async Task<IActionResult> UploadHandler()
        {

            var formCollection = await Request.ReadFormAsync();
            var file = formCollection.Files.First();

            var FolderCategory = Request.Form["FolderCategory"].ToString();
            var ProcurementID = Request.Form["ProcurementRequest"].ToString();
            // 
            if (file == null || file.Length == 0)
            {
                return BadRequest("No file selected");
            }

            // Replace "path/to/folder" with the actual folder path
            var folderPath = Path.Combine(FolderCategory, ProcurementID);
            var filePath = Path.Combine("Files", "Procurement", folderPath);
            var filecombine = Path.Combine(filePath, file.FileName);
            var absoluteFolderPath = Path.Combine(Directory.GetCurrentDirectory(), filePath);
            if (!Directory.Exists(absoluteFolderPath))
            {
                Directory.CreateDirectory(absoluteFolderPath);
            }

            using (var stream = new FileStream(filecombine, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }
            var returnedPath = Path.Combine(FolderCategory, ProcurementID, file.FileName);
            return Ok(new { returnedPath });



        }

        [HttpDelete]
        [Route("DeleteProcurementFile/{FolderCategory}/{ProcurementID}/{fileName}")]
        public async Task<IActionResult> DeleteVendorFile(string FolderCategory, string ProcurementID, string fileName)
        {

            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "Files", "VendorFileDetails", FolderCategory, ProcurementID, fileName);

            try
            {
                if (System.IO.File.Exists(filePath))
                {
                    System.IO.File.Delete(filePath);
                    return Ok(new { fileName });
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


        [HttpPut]
        [Route("UpdateProcurementRequestStatus/{requisition_Status_ID}")]
        public async Task<IActionResult> UpdateProcurementRequestStatus(int requisition_Status_ID, Procurement_Request ProcurementRequestDetails)
        {
            try
            {
                var results = await _ProcurementDetailsRepository.UpdateProcurementRequestStatusAsync(requisition_Status_ID, ProcurementRequestDetails);
                return Ok(results);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }


        [HttpGet]
        [Route("GetProcurementRequestDetails")]
        public async Task<IActionResult> GetProcurementRequestDetails()
        {
            try
            {
                var result = await _ProcurementDetailsRepository.GetProcurementRequestDetailsAsync();
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }


        [HttpGet]
        [Route("GetProcurementDetailsByID/{ProcurementDetailsID}")]
        public async Task<IActionResult> GetProcurementDetailsByID(int ProcurementDetailsID)
        {
            try
            {
                var result = await _ProcurementDetailsRepository.GetProcurementDetailsByIDAsync(ProcurementDetailsID);
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpGet]
        [Route("GetDepositByID/{ProcurementDetailsID}")]
        public async Task<IActionResult> GetDepositByID(int ProcurementDetailsID)
        {
            try
            {
                var result = await _ProcurementDetailsRepository.GetDepositByIDAsync(ProcurementDetailsID);
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpGet]
        [Route("GetFullPaymentMadeByID/{ProcurementDetailsID}")]
        public async Task<IActionResult> GetFullPaymentMadeByID(int ProcurementDetailsID)
        {
            try
            {
                var result = await _ProcurementDetailsRepository.GetFullPaymentMadeByIDAsync(ProcurementDetailsID);
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpGet]
        [Route("GetProofOfPaymentByID/{ProcurementDetailsID}")]
        public async Task<IActionResult> GetProofOfPaymentByID(int ProcurementDetailsID)
        {
            try
            {
                var result = await _ProcurementDetailsRepository.GetProofOfPaymentByIDAsync(ProcurementDetailsID);
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpGet]
        [Route("GetVendorConsumable")]
        public async Task<IActionResult> GetVendorConsumable()
        {
            try
            {
                var result = await _ProcurementDetailsRepository.GetVendorConsumableAsync();
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpGet]
        [Route("GetVendorAsset")]
        public async Task<IActionResult> GetVendorAsset()
        {
            try
            {
                var result = await _ProcurementDetailsRepository.GetVendorAssetAsync();
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpGet]
        [Route("GetProcurementConsumable")]
        public async Task<IActionResult> GetProcurementConsumable()
        {
            try
            {
                var result = await _ProcurementDetailsRepository.GetProcurementConsumableAsync();
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpGet]
        [Route("GetProcurementAsset")]
        public async Task<IActionResult> GetProcurementAsset()
        {
            try
            {
                var result = await _ProcurementDetailsRepository.GetProcurementAssetAsync();
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpGet]
        [Route("GetAssetByID/{AssetID}")]
        public async Task<IActionResult> GetAssetByID(int AssetID)
        {
            try
            {
                var result = await _ProcurementDetailsRepository.GetAssetByIDAsync(AssetID);
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpPut]
        [Route("UpdateProcurementDetailsStatus{StatusID}")]
        public async Task<IActionResult> UpdateProcurementDetailsStatus(int StatusID, Procurement_Details ProcurementDetails)
        {
            try
            {
                var results = await _ProcurementDetailsRepository.UpdateProcurementDetailsStatusAsync(StatusID, ProcurementDetails);
                return Ok(results);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

    }
}
