using Azure.Core;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Net.Http.Headers;
using Org.BouncyCastle.Asn1.Cmp;
using ProcionAPI.Models.Entities;
using ProcionAPI.Models.Repositories;
using System.Data.SqlTypes;
using System.Net.Mime;

namespace ProcionAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VendorController : Controller
    {
        private readonly IVendorRepository _VendorRepository;
        public VendorController(IVendorRepository VendorRepository)
        {
            _VendorRepository = VendorRepository;
        }

        [HttpGet]
        [Route("GetAllVendorDetails")]
        public async Task<IActionResult> GetAllOnboardRequest()
        {
            try
            {
                var result = await _VendorRepository.GetAllVendorDetailstAsync();
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpGet]
        [Route("GetVendorDetailByID/{VendorDetailID}")]
        public async Task<IActionResult> GetVendorDetailByID(int VendorDetailID)
        {
            try
            {
                var result = await _VendorRepository.GetVendorDetailByIDAsync(VendorDetailID);
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpGet]
        [Route("getAllApprovedVendors")]
        public async Task<IActionResult> getAllApprovedVendors()
        {
            try
            {
                var result = await _VendorRepository.getAllApprovedVendorsAsync();
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpPost]
        [Route("AddVendorDetails")]
        public async Task<IActionResult> CreateOnboardRequest(Vendor_Detail VenDetails)
        {
            try
            {
                var result = await _VendorRepository.AddVendorDetailsAsync(VenDetails);
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpPut]
        [Route("UpdateVendorDetails/{VendorDetailsID}")]
        public async Task<IActionResult> UpdateVendorDetails(int VendorDetailsID, Vendor_Detail VenDetails)
        {
            try
            {
                var result = await _VendorRepository.UpdateVendorDetailsAsync(VendorDetailsID, VenDetails);
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }


        [HttpDelete]
        [Route("DeleteVendorDetails/{VendorDetailsID}")]
        public async Task<IActionResult> DeleteVendorDetails([FromRoute] int VendorDetailsID)
        {
            try
            {
                var result = await _VendorRepository.DeleteVendorDetailsAsync(VendorDetailsID);
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpPut]
        [Route("UpdateVendorStatus/{VendorID}/{VendorStatusID}")]
        public async Task<IActionResult> UpdateVendorStatus(int VendorID, int VendorStatusID)
        {
            try
            {
                var result = await _VendorRepository.UpdateVendorStatusAsync(VendorID, VendorStatusID);
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }


        [HttpGet]
        [Route("GetFaxByID/{FaxID}")]
        public async Task<IActionResult> GetFaxByID(int FaxID)
        {
            try
            {
                var result = await _VendorRepository.GetFaxByIDAsync(FaxID);
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpGet]
        [Route("GetVatByID/{VatID}")]
        public async Task<IActionResult> GetVatByID(int VatID)
        {
            try
            {
                var result = await _VendorRepository.GetVatByIDAsync(VatID);
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpGet]
        [Route("GetWebsiteByID/{WebsiteID}")]
        public async Task<IActionResult> GetWebsiteByID(int WebsiteID)
        {
            try
            {
                var result = await _VendorRepository.GetWebsiteByIDAsync(WebsiteID);
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpGet]
        [Route("GetLicenseByID/{LicenseID}")]
        public async Task<IActionResult> GetLicenseByID(int LicenseID)
        {
            try
            {
                var result = await _VendorRepository.GetLicenseByIDAsync(LicenseID);
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }
        [HttpGet]
        [Route("GetAgreementByID/{AgreementID}")]
        public async Task<IActionResult> GetAgreementByID(int AgreementID)
        {
            try
            {
                var result = await _VendorRepository.GetAgreementByIDAsync(AgreementID);
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }
        [HttpGet]
        [Route("GetInsuranceByID/{InsuranceID}")]
        public async Task<IActionResult> GetInsuranceByID(int InsuranceID)
        {
            try
            {
                var result = await _VendorRepository.GetInsuranceByIDAsync(InsuranceID);
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }
        [HttpGet]
        [Route("GetPaymentTerms/{PaymentTermsID}")]
        public async Task<IActionResult> GetPaymentTerms(int PaymentTermsID)
        {
            try
            {
                var result = await _VendorRepository.GetPaymentTermsAsync(PaymentTermsID);
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }
        [HttpGet]
        [Route("GetRegistrationByID/{RegistrationID}")]
        public async Task<IActionResult> GetRegistrationByID(int RegistrationID)
        {
            try
            {
                var result = await _VendorRepository.GetRegistrationByIDAsync(RegistrationID);
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }
        [HttpGet]
        [Route("GetIncomeTaxByID/{IncomeTaxID}")]
        public async Task<IActionResult> GetIncomeTaxByID(int IncomeTaxID)
        {
            try
            {
                var result = await _VendorRepository.GetIncomeTaxByIDAsync(IncomeTaxID);
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }
        //////
        [HttpPost]
        [Route("AddFax")]
        public async Task<IActionResult> AddFax(Vendor_Fax Fax)
        {
            try
            {
                var result = await _VendorRepository.AddFaxAsync(Fax);
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpPost]
        [Route("AddWebsite")]
        public async Task<IActionResult> AddWebsite(Vendor_Website Website)
        {
            try
            {
                var result = await _VendorRepository.AddWebsiteAsync(Website);
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpPost]
        [Route("AddLicense")]
        public async Task<IActionResult> AddLicense(Vendor_License License)
        {
            try
            {
                var result = await _VendorRepository.AddLicenseAsync(License);
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpPost]
        [Route("AddInsurance")]
        public async Task<IActionResult> AddInsurance(Vendor_Insurance Insurance)
        {
            try
            {
                var result = await _VendorRepository.AddInsuranceAsync(Insurance);
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }
        [HttpPost]
        [Route("AddPayTerms")]
        public async Task<IActionResult> AddPayTerms(Vendor_Payment_Terms PayTerms)
        {
            try
            {
                var result = await _VendorRepository.AddPayTermsAsync(PayTerms);
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }
        [HttpPost]
        [Route("AddAgreement")]
        public async Task<IActionResult> AddAgreement(Vendor_Agreement Agreement)
        {
            try
            {
                var result = await _VendorRepository.AddAgreementAsync(Agreement);
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }
        [HttpPost]
        [Route("AddRegistered")]
        public async Task<IActionResult> AddRegistered(Vendor_Registration Registered)
        {
            try
            {
                var result = await _VendorRepository.AddRegisteredAsync(Registered);
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }
        [HttpPost]
        [Route("AddVat")]
        public async Task<IActionResult> AddVat(Vendor_Vat VAT)
        {
            try
            {
                var result = await _VendorRepository.AddVatAsync(VAT);
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }
        [HttpPost]
        [Route("AddIncomeTax")]
        public async Task<IActionResult> AddIncomeTax(Vendor_Tax IncomeTax)
        {
            try
            {
                var result = await _VendorRepository.AddIncomeTaxAsync(IncomeTax);
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }
        /////
        [HttpPut]
        [Route("UpdateFax/{FaxID}")]
        public async Task<IActionResult> UpdateFax(int FaxID,Vendor_Fax Fax)
        {
            try
            {
                var result = await _VendorRepository.UpdateFaxAsync(FaxID, Fax);
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpPut]
        [Route("UpdateWebsite/{WebsiteID}")]
        public async Task<IActionResult> UpdateWebsite(int WebsiteID,Vendor_Website Website)
        {
            try
            {
                var result = await _VendorRepository.UpdateWebsiteAsync(WebsiteID,Website);
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpPut]
        [Route("UpdateLicense/{LicenseID}")]
        public async Task<IActionResult> UpdateLicense(int LicenseID,Vendor_License License)
        {
            try
            {
                var result = await _VendorRepository.UpdateLicenseAsync(LicenseID,License);
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpPut]
        [Route("UpdateInsurance/{InsuranceID}")]
        public async Task<IActionResult> UpdateInsurance(int InsuranceID,Vendor_Insurance Insurance)
        {
            try
            {
                var result = await _VendorRepository.UpdateInsuranceAsync(InsuranceID,Insurance);
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }
        [HttpPut]
        [Route("UpdatePayTerms/{PaymentTermsID}")]
        public async Task<IActionResult> UpdatePayTerms(int PaymentTermsID,Vendor_Payment_Terms PayTerms)
        {
            try
            {
                var result = await _VendorRepository.UpdatePayTermsAsync(PaymentTermsID,PayTerms);
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }
        [HttpPut]
        [Route("UpdateAgreement/{AgreementID}")]
        public async Task<IActionResult> UpdateAgreement(int AgreementID,Vendor_Agreement Agreement)
        {
            try
            {
                var result = await _VendorRepository.UpdateAgreementAsync(AgreementID,Agreement);
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }
        [HttpPut]
        [Route("UpdateRegistered/{RegistrationID}")]
        public async Task<IActionResult> UpdateRegistered(int RegistrationID,Vendor_Registration Registered)
        {
            try
            {
                var result = await _VendorRepository.UpdateRegisteredAsync(RegistrationID,Registered);
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }
        [HttpPut]
        [Route("UpdateVat/{VatID}")]
        public async Task<IActionResult> UpdateVat(int VatID, Vendor_Vat VAT)
        {
            try
            {
                var result = await _VendorRepository.UpdateVatAsync(VatID, VAT);
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }
        [HttpPut]
        [Route("UpdateIncomeTax/{IncomeTaxID}")]
        public async Task<IActionResult> UpdateIncomeTax(int IncomeTaxID,Vendor_Tax IncomeTax)
        {
            try
            {
                var result = await _VendorRepository.UpdateIncomeTaxAsync(IncomeTaxID,IncomeTax);
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }
        /// 
        [HttpDelete]
        [Route("DeleteFaxByID/{FaxID}")]
        public async Task<IActionResult> DeleteFaxByID(int FaxID)
        {
            try
            {
                var result = await _VendorRepository.DeleteFaxByIDAsync(FaxID);
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpDelete]
        [Route("DeleteVatByID/{VatID}")]
        public async Task<IActionResult> DeleteVatByID(int VatID)
        {
            try
            {
                var result = await _VendorRepository.DeleteVatByIDAsync(VatID);
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpDelete]
        [Route("DeleteWebsiteByID/{WebsiteID}")]
        public async Task<IActionResult> DeleteWebsiteByID(int WebsiteID)
        {
            try
            {
                var result = await _VendorRepository.DeleteWebsiteByIDAsync(WebsiteID);
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpDelete]
        [Route("DeleteLicenseByID/{LicenseID}")]
        public async Task<IActionResult> DeleteLicenseByID(int LicenseID)
        {
            try
            {
                var result = await _VendorRepository.DeleteLicenseByIDAsync(LicenseID);
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }
        [HttpDelete]
        [Route("DeleteAgreementByID/{AgreementID}")]
        public async Task<IActionResult> DeleteAgreementByID(int AgreementID)
        {
            try
            {
                var result = await _VendorRepository.DeleteAgreementByIDAsync(AgreementID);
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }
        [HttpDelete]
        [Route("DeleteInsuranceByID/{InsuranceID}")]
        public async Task<IActionResult> DeleteInsuranceByID(int InsuranceID)
        {
            try
            {
                var result = await _VendorRepository.DeleteInsuranceByIDAsync(InsuranceID);
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }
        [HttpDelete]
        [Route("DeletePaymentTerms/{PaymentTermsID}")]
        public async Task<IActionResult> DeletePaymentTerms(int PaymentTermsID)
        {
            try
            {
                var result = await _VendorRepository.DeletePaymentTermsAsync(PaymentTermsID);
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }
        [HttpDelete]
        [Route("DeleteRegistrationByID/{RegistrationID}")]
        public async Task<IActionResult> DeleteRegistrationByID(int RegistrationID)
        {
            try
            {
                var result = await _VendorRepository.DeleteRegistrationByIDAsync(RegistrationID);
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }
        [HttpDelete]
        [Route("DeleteIncomeTaxByID/{IncomeTaxID}")]
        public async Task<IActionResult> DeleteIncomeTaxByID(int IncomeTaxID)
        {
            try
            {
                var result = await _VendorRepository.DeleteIncomeTaxByIDDAsync(IncomeTaxID);
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }
        //////

        [HttpGet]
        [Route("GetVendorByID/{VendorID}")]
        public async Task<IActionResult> GetVendorByID(int VendorID)
        {
            try
            {
                var result = await _VendorRepository.GetVendorByIDAsync(VendorID);
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpPost]
        [Route("GetVendorFiles/{FolderCategory}/{VendorNo}/{fileName}")]
        public IActionResult GetFile(string FolderCategory, string VendorNo, string fileName)
        {
            var filePath = Path.Combine(Directory.GetCurrentDirectory(),"Files","VendorFileDetails", FolderCategory, VendorNo, fileName);
            var fileBytes = System.IO.File.ReadAllBytes(filePath);
            var contentType = "application/octet-stream";
            return File(fileBytes, contentType, fileName);
        }

        [HttpPost]
        [DisableRequestSizeLimit]
        [Route("uploadVendorFile")]
        public async Task<IActionResult> UploadHandler()
        {

            var formCollection = await Request.ReadFormAsync();
            var file = formCollection.Files.First();

            var FolderCategory = Request.Form["FolderCategory"].ToString();
            var VendorNo = Request.Form["VendorNo"].ToString();
            // 
            if (file == null || file.Length == 0)
            {
                return BadRequest("No file selected");
            }

            // Replace "path/to/folder" with the actual folder path
            var folderPath = Path.Combine(FolderCategory, VendorNo);
            var filePath = Path.Combine("Files", "VendorFileDetails",folderPath);
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
            var returnedPath = Path.Combine(FolderCategory, VendorNo, file.FileName);
            return Ok(new { returnedPath });


           
        }

        [HttpDelete]
        [Route("DeleteVendorFile/{FolderCategory}/{VendorNo}/{fileName}")]
        public async Task<IActionResult> DeleteVendorFile(string FolderCategory, string VendorNo, string fileName)
        {

            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "Files", "VendorFileDetails", FolderCategory, VendorNo, fileName);

            try
            {
                if (System.IO.File.Exists(filePath))
                {
                    System.IO.File.Delete(filePath);
                    return Ok(new {fileName});
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


        //validation

        [HttpGet]
        [Route("VatRegNumberVal/{vatNumber}")]
        public async Task<IActionResult> VatRegNumberVal(string vatNumber)
        {
            try
            {
                var result = await _VendorRepository.VatRegNumberValAsync(vatNumber);
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpGet]
        [Route("IncomeTaxRegNumberVal/{IncomeTaxNumber}")]
        public async Task<IActionResult> IncomeTaxRegNumberVal(string IncomeTaxNumber)
        {
            try
            {
                var result = await _VendorRepository.IncomeTaxRegNumberValAsync(IncomeTaxNumber);
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpGet]
        [Route("CompanyRegNumberVal/{CompanyRegNumber}")]
        public async Task<IActionResult> CompanyRegNumberVal(string CompanyRegNumber)
        {
            try
            {
                var result = await _VendorRepository.CompanyRegNumberValAsync(CompanyRegNumber);
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpGet]
        [Route("LicenseNumberVal/{LicenseNumber}")]
        public async Task<IActionResult> LicenseNumberVal(string LicenseNumber)
        {
            try
            {
                var result = await _VendorRepository.LicenseNumberValAsync(LicenseNumber);
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        ///Approved vendor things
        //Post
        [HttpPost]
        [Route("AddBEEDetails")]
        public async Task<IActionResult> CreateBEEDetails(Vendor_BEE VenBee)
        {
            try
            {
                var result = await _VendorRepository.AddBEEDetailsAsync(VenBee);
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpPost]
        [Route("AddDueDiligence")]
        public async Task<IActionResult> CreateDueDiligence(Due_Dillegence VenDueDiligence)
        {
            try
            {
                var result = await _VendorRepository.AddDueDiligenceAsync(VenDueDiligence);
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpPost]
        [Route("AddPOPI")]
        public async Task<IActionResult> CreatePOPI(POPI VenPOPI)
        {
            try
            {
                var result = await _VendorRepository.AddPOPIAsync(VenPOPI);
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }
        //get
        [HttpGet]
        [Route("GetBEEDetails/{VendorID}")]
        public async Task<IActionResult> GetBEEDetails(int VendorID)
        {
            try
            {
                var result = await _VendorRepository.GetBEEDetailsAsync(VendorID);
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpGet]
        [Route("GetDueDiligence/{VendorID}")]
        public async Task<IActionResult> GetDueDiligence(int VendorID)
        {
            try
            {
                var result = await _VendorRepository.GetDueDiligenceAsync(VendorID);
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpGet]
        [Route("GetPOPI/{DueDiligenceID}")]
        public async Task<IActionResult> GetPOPI(int DueDiligenceID)
        {
            try
            {
                var result = await _VendorRepository.GetPOPIAsync(DueDiligenceID);
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpPut]
        [Route("UpdateBEEDetails/{VendorID}")]
        public async Task<IActionResult> UpdateBEEDetails(int VendorID, Vendor_BEE VenBee)
        {
            try
            {
                var result = await _VendorRepository.UpdateBEEDetailsAsync(VendorID, VenBee);
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpPut]
        [Route("UpdateDueDiligence/{VendorID}")]
        public async Task<IActionResult> UpdateDueDiligence(int VendorID, Due_Dillegence VenDueDiligence)
        {
            try
            {
                var result = await _VendorRepository.UpdateDueDiligenceAsync(VendorID, VenDueDiligence);
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpPut]
        [Route("UpdatePOPI/{VendorID}")]
        public async Task<IActionResult> UpdatePOPI(int DueDiligenceID, POPI VenPOPI)
        {
            try
            {
                var result = await _VendorRepository.UpdatePOPIAsync(DueDiligenceID, VenPOPI);
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }
        //delete 

        [HttpDelete]
        [Route("DeleteBEEDetails/{VenBeeID}")]
        public async Task<IActionResult> DeleteBEEDetails(int VenBeeID)
        {
            try
            {
                var result = await _VendorRepository.DeleteBEEDetailsAsync(VenBeeID);
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpDelete]
        [Route("DeleteDueDiligence/{DueDiligenceID}")]
        public async Task<IActionResult> DeleteDueDiligence(int DueDiligenceID)
        {
            try
            {
                var result = await _VendorRepository.DeleteDueDiligenceAsync(DueDiligenceID);
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpDelete]
        [Route("DeletePOPI/{POPIID}")]
        public async Task<IActionResult> DeletePOPI(int POPIID)
        {
            try
            {
                var result = await _VendorRepository.DeletePOPIAsync(POPIID);
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        //status 


        [HttpPut]
        [Route("ChangeVendorStatus/{statusID}/{VendorID}")]
        public async Task<IActionResult> ChangeVendorStatus(int statusID, int VendorID)
        {
            try
            {
                var result = await _VendorRepository.ChangeVendorStatusAsync(statusID, VendorID);
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpGet]
        [Route("getAllOnboardRequest/{OnboardRequestID}")]
        public async Task<IActionResult> getAllOnboardRequest(int OnboardRequestID)
        {
            try
            {
                var result = await _VendorRepository.getAllOnboardRequestAsync(OnboardRequestID);
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpPut]
        [Route("ChangeOnboardStatus/{statusID}/{onboardRequestId}/{VenID}")]
        public async Task<IActionResult> ChangeOnboardStatus(int statusID, int onboardRequestId,int VenID)
        {
            try
            {
                var result = await _VendorRepository.ChangeOnboardStatusAsync(statusID, onboardRequestId, VenID);
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

    }
}

// return Ok($"File {fileName} deleted successfully");
