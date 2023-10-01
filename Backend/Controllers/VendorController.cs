using Azure.Core;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Net.Http.Headers;
using Org.BouncyCastle.Asn1.Cmp;
using ProcionAPI.Models.Entities;
using ProcionAPI.Models.Repositories;
using System.Data.SqlTypes;
using System.Net.Mime;
using ProcionAPI.Data;
using Microsoft.AspNetCore.Cors;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Net.Http.Headers;
using Hangfire;
using System.Reflection;
using System.CodeDom;
using System.Collections.Generic;
using DocumentFormat.OpenXml.Office2010.ExcelAc;

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
        [Route("getAllApprovedVendors/{VendorStatusID}")]
        public async Task<IActionResult> getAllApprovedVendors(int VendorStatusID)
        {
            try
            {
                var result = await _VendorRepository.getAllApprovedVendorsAsync(VendorStatusID);
                return Ok(result);
            }
            catch (Exception)
            {

                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpGet]
        [Route("getAllOtherVendors/{VendorStatusID}")]
        public async Task<IActionResult> getAllOtherVendors(int VendorStatusID)
        {
            try
            {
                var result = await _VendorRepository.getAllOtherVendorsAsync(VendorStatusID);
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
        [Route("GetInsuranceByID/{VendorID}")]
        public async Task<IActionResult> GetInsurancesByID(int VendorID)
        {
            try
            {
                var result = await _VendorRepository.GetInsuranceByIDAsync(VendorID);
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
        [Route("UpdateInsurance/{VendorID}")]
        public async Task<IActionResult> UpdateInsurance(int VendorID, Vendor_Insurance Insurance)
        {
            try
            {
                var result = await _VendorRepository.UpdateInsuranceAsync(VendorID, Insurance);
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
        [Route("DeleteInsuranceByID/{VendorID}/{InsuranceTypeID}")]
        public async Task<IActionResult> DeleteInsuranceByID(int VendorID,int InsuranceTypeID)
        {
            try
            {
                var result = await _VendorRepository.DeleteInsuranceByIDAsync(VendorID, InsuranceTypeID);
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

        [HttpGet]
        [Route("GetVendorFiles/{FolderCategory}/{VendorNo}/{fileName}")]
        public async Task<IActionResult> GetFile(string FolderCategory, string VendorNo, string fileName)
        {
            string connectionString = "DefaultEndpointsProtocol=https;AccountName=procionfiles;AccountKey=dGF1LT/uPZ+oyq6lJMMAMyrkWazjBRC1G/k3Elirkg8q0pUDGdQ+zAHLEescUbUqFdeYkOu4Kk+r+ASt9YvsFg==;EndpointSuffix=core.windows.net";
            BlobServiceClient blobServiceClient = new BlobServiceClient(connectionString);

            // Specify your container name where the files are stored
            string containerName = "procionfiles";
            BlobContainerClient containerClient = blobServiceClient.GetBlobContainerClient(containerName);

            // Create a reference to the blob within the container
            string blobPath = $"VendorFileDetails/{FolderCategory}/{VendorNo}/{fileName}";
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
            if (fileName.Contains(".pdf"))
            {
                contentType = "application/pdf";
            }

            // Return the file as a FileResult
            return File(memoryStream, contentType, fileName);
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
            string blobName = $"VendorFileDetails/{FolderCategory}/{VendorNo}/{file.FileName}";

            // Get a reference to the blob and upload the file
            BlobClient blobClient = containerClient.GetBlobClient(blobName);
            using (Stream stream = file.OpenReadStream())
            {
                await blobClient.UploadAsync(stream, true);
            }

            // Return the URL of the uploaded blob as the response
            return Ok(new { url = blobClient.Uri.ToString() });



        }

        [HttpDelete]
        [Route("DeleteVendorFile/{FolderCategory}/{VendorNo}/{fileName}")]
        public async Task<IActionResult> DeleteVendorFile(string FolderCategory, string VendorNo, string fileName)
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
                string blobName = $"VendorFileDetails/{FolderCategory}/{VendorNo}/{fileName}";

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


        private void DeleteExistingJobs(int VendorID)
        {
            var monitor = JobStorage.Current.GetMonitoringApi();

            var jobsProcessing = monitor.ProcessingJobs(0, int.MaxValue)
                .Where(x => x.Value.Job.Method.Name == "getBEE");
            foreach (var j in jobsProcessing)
            {
                var t = (int)j.Value.Job.Args[0];
                if (t == VendorID)
                {
                    BackgroundJob.Delete(j.Key);
                }
            }

            var jobsScheduled = monitor.ScheduledJobs(0, int.MaxValue)
                .Where(x => x.Value.Job.Method.Name == "getBEE");
            foreach (var j in jobsScheduled)
            {
                var t = (int)j.Value.Job.Args[0];
                if (t == VendorID)
                {
                    BackgroundJob.Delete(j.Key);
                }
            }
        }


        [HttpGet]
        [Route("DelayedJob/{VendorID}/{date}")]
        public string DelayedJob(int VendorID, DateTime date)
        {

            DeleteExistingJobs(VendorID);

            var selectedDate = new DateTimeOffset(date, TimeSpan.Zero);
           // selectedDate = selectedDate.LocalDateTime(selectedDate);
            BackgroundJob.Schedule(() => getBEE(VendorID, date, 1), selectedDate.AddYears(1).AddDays(-21).ToLocalTime());

            BackgroundJob.Schedule(() => getBEE(VendorID, date, 2), selectedDate.AddYears(1).AddDays(-7).ToLocalTime());

            BackgroundJob.Schedule(() => getBEE(VendorID, date, 3), selectedDate.AddYears(1).ToLocalTime());


            return null;

        }

        [HttpPost]
        [Route("getBEE")]
        public async Task<IActionResult> getBEE(int VendorID, DateTime date, int NotifyWhenNumber)
        {

            var VenBee = await _VendorRepository.GetBEEDetailsAsync(VendorID);
            if(VenBee.Date == date && VenBee != null)
            {
                if (NotifyWhenNumber == 1)
                {

                    var Description = "3 Weeks before " + VenBee.Vendor.Name + " BEE expires!";
                    var result = await _VendorRepository.AddVendorBEENotificationAsync(date, VendorID, Description);
                }
                else if (NotifyWhenNumber == 2)
                {
                    var Description = "1 Week before " + VenBee.Vendor.Name + " BEE expires!";
                    var result = await _VendorRepository.AddVendorBEENotificationAsync(date, VendorID, Description);
                }
                else if (NotifyWhenNumber == 3)
                {
                    var Description = VenBee.Vendor.Name + " BEE expires has expired!";
                    var result = await _VendorRepository.AddVendorBEENotificationAsync(date, VendorID, Description);
                }
            }

            
            return Ok();

        }

        [HttpGet]
        [Route("RecurringJobDelegation")]
        public string RecurringJobs()
        {
            //Recurring Jobs
            //Recurring jobs fire many times on the specified CRON schedule.
            RecurringJob.AddOrUpdate(() => SoleSupplierPerformanceReview(), Cron.Monthly, TimeZoneInfo.Local);

            return null;
        }

        [HttpPost]
        [Route("SoleSupplierPerformanceReview")]
        public async Task<IActionResult> SoleSupplierPerformanceReview()
        {
            try
            {
                var vendors = await _VendorRepository.GetAllSoleSupplierVendorAsync();
                if(vendors != null)
                {
                    foreach(var ven in vendors)
                    {
                        var result = await _VendorRepository.GenerateSoleSupplierPerformanceReviewAsync(ven);
                    }
                    
                }
                
                return Ok();
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpPost]
        [Route("VendorAddNotification")]
        public async Task<IActionResult> VendorAddNotification(Notification VendorNotification)
        {
            try
            {
               var result = await _VendorRepository.AddNotificationAsync(VendorNotification);
               return Ok(result);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpGet]
        [Route("DeleteVendorValidation/{VendorDetailID}")]
        public async Task<IActionResult> DeleteVendorValidation(int VendorDetailID)
        {
            try
            {
                var result = await _VendorRepository.DeleteVendorValidationAsync(VendorDetailID); ;
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
