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
            catch(Exception  ex)
            {
                Console.WriteLine(ex.Message);
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpPost]
        [Route("AddInvoice")]
        public async Task<IActionResult> AddInvoice(Procurement_Invoice AddINV)
        {
            try
            {
                var results = await _ProcurementDetailsRepository.AddInvoiceAsync(AddINV);
                return Ok(results);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
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
        [Route("UpdateProcurementDetailsStatus/{StatusID}")]
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

        [HttpGet]
        [Route("GetProcurementDetailsByRequestID/{RequestID}")]
        public async Task<IActionResult> GetProcurementDetailsByRequestID(int RequestID)
        {
            try
            {
                var result = await _ProcurementDetailsRepository.GetProcurementDetailsByRequestIDAsync(RequestID);
                return Ok(result);
            }
            catch (Exception)
            {
                return null;
                // return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }
        [HttpGet]
        [Route("GetUnpaidProcurementDetails")]
        public async Task<IActionResult> GetUnpaidProcurementDetails()
        {
            try
            {
                var result = await _ProcurementDetailsRepository.GetUnpaidProcurementDetailsAsync();
                return Ok(result);
            }
            catch (Exception)
            {
                return null;
               // return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpPost]
        [Route("ProcurementAddNotification")]
        public async Task<IActionResult> ProcurementAddNotification(Notification ProcurementNotification)
        {
            try
            {
                var result = await _ProcurementDetailsRepository.AddNotificationAsync(ProcurementNotification);
                return Ok(result);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpGet]
        [Route("GetConsumablesForRequest{procurementRequestID}")]

        public async Task<IActionResult> GetConsumablesForRequest(int procurementRequestID)
        {
            try
            {
                var result = await _ProcurementDetailsRepository.GetConsumableForRequest(procurementRequestID);
                return Ok(result);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpGet]
        [Route("GetConsumableToRecieve/{procurementRequestID}")]

        public async Task<IActionResult> GetConsumablesForRequestConsRecieve(int procurementRequestID)
        {
            try
            {
                var result = await _ProcurementDetailsRepository.GetConsumableForRequestConsRecieve(procurementRequestID);
                return Ok(result);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpPut]
        [Route("FinalizeProcurementRequest{DetailsID}")]
        public async Task<IActionResult> FinalizeProcurementRequest(int DetailsID)
        {
            try
            {
                var results = await _ProcurementDetailsRepository.FinalizeProcurementRequest(DetailsID);
                return Ok(results);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }
        [HttpPut]
        [Route("RequisitionApproval{DetailsID}")]
        public async Task<IActionResult> RequisitionApproval(int DetailsID)
        {
            try
            {
                var results = await _ProcurementDetailsRepository.RequisitionApproval(DetailsID);
                return Ok(results);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpGet]
        [Route("GetUnapprovedRequests")]
        public async Task<IActionResult> GetUnapprovedRequests()
        {
              try
            {
                var result = await _ProcurementDetailsRepository.GetUnapprovedRequests();
                return Ok(result);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }   
        

        [HttpPost]
        [DisableRequestSizeLimit]
        [Route("uploadProofFile")]
        public async Task<IActionResult> UploadPOPHandler()
        {
            var formCollection = await Request.ReadFormAsync();
            var file = formCollection.Files.First();


            var ProofName = Request.Form["ProofName"];

            if (file == null || file.Length == 0)
            {
                return BadRequest("No file selected");
            }

            var folderPath = Path.Combine("Files", "ProofOfPayment", ProofName);
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

            var PathSaved = Path.Combine(ProofName, file.FileName);
            return Ok(new { PathSaved });
        }


        [HttpPost]
        [DisableRequestSizeLimit]
        [Route("uploadInvoice")]
        public async Task<IActionResult> UploadInvoice()
        {
            var formCollection = await Request.ReadFormAsync();
            var file = formCollection.Files.First();


            var InvoiceName = Request.Form["InvoiceName"];

            if (file == null || file.Length == 0)
            {
                return BadRequest("No file selected");
            }

            var folderPath = Path.Combine("Files", "Invoices", InvoiceName);
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

            var PathSaved = Path.Combine(InvoiceName, file.FileName);
            return Ok(new { PathSaved });
        }

        [HttpGet]
        [Route("GetProcurementAccountCodeDetails/{year}/{Month}/{department}")]

        public async Task<IActionResult> GetProcurementAccountCodeDetails(int year, int Month, string department)
        {
            try
            {
                var result = await _ProcurementDetailsRepository.GetProcurementAccountCodeDetailsAsync(year,Month,department);
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500,"Internal Server Error. Please contact support.");
            }
        }

        [HttpGet]
        [Route("getAssets")]

        public async Task<IActionResult> getAssets()
        {
            try
            {
                var result = await _ProcurementDetailsRepository.getAssetsAsync();
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }
        [HttpPut]
        [Route("UpdateProcurementDetailsStatus/{StatusID}/{ProcurementID}")]
        public async Task<IActionResult> UpdateProcurementRequestStatus(int StatusID, int ProcurementID)
        {
            try
            {
                var results = await _ProcurementDetailsRepository.UpdateProcurementDetailsStatusAsync(StatusID, ProcurementID);
                return Ok(results);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpPut]
        [Route("UpdateBudgetLineAmount/{ActualAmount}")]

        public async Task<IActionResult> UpdateBudgetLineAmount(decimal ActualAmount, Budget_Line budget_Line)
        {
            try
            {
                var result = await _ProcurementDetailsRepository.UpdateBudgetLineAmountAsync(budget_Line, ActualAmount);
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpPut]
        [Route("UpdatePaymentStatus/{StatusID}/{ProcurementID}")]
        public async Task<IActionResult> UpdatePaymentStatus(int StatusID, int ProcurementID)
        {
            try
            {
                var results = await _ProcurementDetailsRepository.UpdatePaymentStatusAsync(StatusID, ProcurementID);
                return Ok(results);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpGet]
        [Route("getAssetStatuses")]

        public async Task<IActionResult> getAssetStatuses()
        {
            try
            {
                var result = await _ProcurementDetailsRepository.GetAssetStatusesAsync();
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }
    }
}
