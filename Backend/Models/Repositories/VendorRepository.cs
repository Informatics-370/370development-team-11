﻿using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using ProcionAPI.Data;
using ProcionAPI.Models.Entities;
using ProcionAPI.Controllers;
using Azure.Core;
using Org.BouncyCastle.Asn1.Cmp;

namespace ProcionAPI.Models.Repositories
{
    public class VendorRepository : IVendorRepository
    {
        private readonly AppDBContext _dbContext;

        public VendorRepository(AppDBContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<Vendor_Detail[]> GetAllVendorDetailstAsync()
        {
            IQueryable<Vendor_Detail> query = _dbContext.Vendor_Detail.Include(x => x.Vendor).Include(x => x.Vendor_Category);
            
            return await query.ToArrayAsync();
        }

        public async Task<Vendor_Detail> GetVendorDetailByIDAsync(int VendorDetailID)
        {
            IQueryable<Vendor_Detail> query = _dbContext.Vendor_Detail.Include(x => x.Vendor).Include(x => x.Vendor_Category).Where(x => x.Vendor_Detail_ID == VendorDetailID);

            return await query.FirstOrDefaultAsync();
        }

        public async Task<Vendor[]> getAllApprovedVendorsAsync()
        {
            IQueryable<Vendor> query = _dbContext.Vendor.Include(x => x.Vendor_Status).Where(x => x.Vendor_Status_ID == 2);

            return await query.ToArrayAsync();
        }

        public async Task<Vendor> GetVendorByIDAsync(int VendorID)
        {
            IQueryable<Vendor> query = _dbContext.Vendor.Include(x => x.Vendor_Status).Where(x => x.Vendor_ID == VendorID);

            return await query.FirstOrDefaultAsync();
        }

        public async Task<Vendor_Detail[]> AddVendorDetailsAsync(Vendor_Detail VenDetails)
        {
            Vendor existingVendor = await _dbContext.Vendor.FirstOrDefaultAsync(x => x.Vendor_ID == VenDetails.Vendor_ID);

            if (existingVendor != null)
            {
                VenDetails.Vendor = existingVendor;
            }

            Vendor_Category existingVendorCategory = await _dbContext.Vendor_Category.FirstOrDefaultAsync(x => x.Vendor_Category_ID == VenDetails.Vendor_Category_ID);

            if (existingVendorCategory != null)
            {
                VenDetails.Vendor_Category = existingVendorCategory;
            }



            await _dbContext.Vendor_Detail.AddAsync(VenDetails);
            await _dbContext.SaveChangesAsync();

            return new Vendor_Detail[] { VenDetails };
        }

        public async Task<Vendor_Detail> UpdateVendorDetailsAsync(int VendorDetailsID, Vendor_Detail VenDetails)
        { //also see userid
            var VenDetail = await _dbContext.Vendor_Detail.FirstOrDefaultAsync(x => x.Vendor_Detail_ID == VendorDetailsID);


            VenDetail.Vendor_Category = new Vendor_Category();

            Vendor_Category existingVenCat = await _dbContext.Vendor_Category.FirstOrDefaultAsync(x => x.Vendor_Category_ID == VenDetails.Vendor_Category_ID);

            VenDetail.Vendor_Category = existingVenCat;

            VenDetail.Vendor = new Vendor();

            Vendor existingVendor = await _dbContext.Vendor.FirstOrDefaultAsync(x => x.Vendor_ID == VenDetails.Vendor_ID);

            VenDetail.Vendor = existingVendor;

            var existingVendorStatus = await _dbContext.Vendor_Status.FindAsync(VenDetails.Vendor.Vendor_Status_ID);


            VenDetail.Vendor.Vendor_Status = existingVendorStatus;

            VenDetail.Telephone_Num = VenDetails.Telephone_Num;
            VenDetail.Registered_Address = VenDetails.Registered_Address;
            VenDetail.WebsiteProvided= VenDetails.WebsiteProvided;
            VenDetail.FaxProvided= VenDetails.FaxProvided;
            VenDetail.Contact_Person_Title = VenDetails.Contact_Person_Title;
            VenDetail.Contact_Person_Name = VenDetails.Contact_Person_Name;
            VenDetail.Contact_Person_Email = VenDetails.Contact_Person_Email;
            VenDetail.Contact_Person_ContactNum = VenDetails.Contact_Person_ContactNum;

            VenDetail.Description_GSP= VenDetails.Description_GSP;
            VenDetail.Registration_Provided= VenDetails.Registration_Provided;
            VenDetail.VatRegistered= VenDetails.VatRegistered;
            VenDetail.Income_Tax_Num_Provided = VenDetails.Income_Tax_Num_Provided;
            VenDetail.Signed_Agreement_Provided = VenDetails.Signed_Agreement_Provided;
            VenDetail.Insurance_Provided = VenDetails.Insurance_Provided;
            VenDetail.Payment_Terms_Provided = VenDetails.Payment_Terms_Provided;
            VenDetail.License_Num_Provided = VenDetails.License_Num_Provided;
            VenDetail.POPIA_Provided = VenDetails.POPIA_Provided;   
            VenDetail.SoleSupplierProvided= VenDetails.SoleSupplierProvided;
            
            VenDetail.Bank_Name = VenDetails.Bank_Name;
            VenDetail.Branch_Code = VenDetails.Branch_Code;
            VenDetail.Account_Holder = VenDetails.Account_Holder;
            VenDetail.Account_Type = VenDetails.Account_Holder;
            VenDetail.Bank_Account_Number = VenDetails.Bank_Account_Number;
            VenDetail.Bank_Contact_Name = VenDetails.Bank_Contact_Name;
            VenDetail.Bank_Contact_PhoneNum = VenDetails.Bank_Contact_PhoneNum;
            VenDetail.BankStampedConfirtmation = VenDetails.BankStampedConfirtmation;

            await _dbContext.SaveChangesAsync();

            return VenDetail;
        }

        public async Task<Vendor_Detail> DeleteVendorDetailsAsync(int VendorDetailsID)
        {
            var VendorToDelete = await _dbContext.Vendor_Detail.FirstOrDefaultAsync(x => x.Vendor_Detail_ID == VendorDetailsID);
            _dbContext.Vendor_Detail.Remove(VendorToDelete);
            await _dbContext.SaveChangesAsync();

            return VendorToDelete;
        }

        public async Task<Vendor> UpdateVendorStatusAsync(int VendorID, int VendorStatusID)
        { //also see userid
            var VendorUpdate = await _dbContext.Vendor.FirstOrDefaultAsync(x => x.Vendor_ID == VendorID);

            var existingVendorStatus = await _dbContext.Vendor_Status.FindAsync(VendorStatusID);

            VendorUpdate.Vendor_Status_ID = VendorStatusID;
            VendorUpdate.Vendor_Status = existingVendorStatus;

            

            await _dbContext.SaveChangesAsync();

            return VendorUpdate;
        }



        //
        public async Task<Vendor_Fax> GetFaxByIDAsync(int FaxID)
        {
            IQueryable<Vendor_Fax> query = _dbContext.Vendor_Fax.Where(x => x.Vendor_Detail_ID == FaxID).Include(x => x.Vendor_Detail);

            return await query.FirstOrDefaultAsync();
        }
        public async Task<Vendor_Vat> GetVatByIDAsync(int VatID)
        {
            IQueryable<Vendor_Vat> query = _dbContext.Vendor_Vat.Where(x => x.Vendor_Detail_ID == VatID).Include(x => x.Vendor_Detail);

            return await query.FirstOrDefaultAsync();
        }

        public async Task<Vendor_Website> GetWebsiteByIDAsync(int WebsiteID)
        {
            IQueryable<Vendor_Website> query = _dbContext.Vendor_Website.Where(x => x.Vendor_Detail_ID == WebsiteID).Include(x => x.Vendor_Detail);

            return await query.FirstOrDefaultAsync();
        }

        public async Task<Vendor_License> GetLicenseByIDAsync(int LicenseID)
        {
            IQueryable<Vendor_License> query = _dbContext.Vendor_License.Where(x => x.Vendor_Detail_ID == LicenseID).Include(x => x.Vendor_Detail);

            return await query.FirstOrDefaultAsync();
        }

        public async Task<Vendor_Agreement> GetAgreementByIDAsync(int AgreementID)
        {
            IQueryable<Vendor_Agreement> query = _dbContext.Vendor_Agreement.Where(x => x.Vendor_Detail_ID == AgreementID).Include(x => x.Vendor_Detail);

            return await query.FirstOrDefaultAsync();
        }

        public async Task<Vendor_Insurance> GetInsuranceByIDAsync(int InsuranceID)
        {
            IQueryable<Vendor_Insurance> query = _dbContext.Vendor_Insurance.Where(x => x.Vendor_Detail_ID == InsuranceID).Include(x => x.Vendor_Detail);

            return await query.FirstOrDefaultAsync();
        }

        public async Task<Vendor_Payment_Terms> GetPaymentTermsAsync(int PaymentTermsID)
        {
            IQueryable<Vendor_Payment_Terms> query = _dbContext.Vendor_Payment_Terms.Where(x => x.Vendor_Detail_ID == PaymentTermsID).Include(x => x.Vendor_Detail);

            return await query.FirstOrDefaultAsync();
        }

        public async Task<Vendor_Registration> GetRegistrationByIDAsync(int RegistrationID)
        {
            IQueryable<Vendor_Registration> query = _dbContext.Vendor_Registration.Where(x => x.Vendor_Detail_ID == RegistrationID).Include(x => x.Vendor_Detail);

            return await query.FirstOrDefaultAsync();
        }

        public async Task<Vendor_Tax> GetIncomeTaxByIDAsync(int IncomeTaxID)
        {
            IQueryable<Vendor_Tax> query = _dbContext.Vendor_Tax.Where(x => x.Vendor_Detail_ID == IncomeTaxID).Include(x => x.Vendor_Detail);

            return await query.FirstOrDefaultAsync();
        }
        //post 
        public async Task<Vendor_Fax[]> AddFaxAsync(Vendor_Fax Fax)
    {
        Vendor_Detail existingVendorDetails = await _dbContext.Vendor_Detail.FirstOrDefaultAsync(x => x.Vendor_Detail_ID == Fax.Vendor_Detail_ID); ;

        if (existingVendorDetails != null)
        {
                Fax.Vendor_Detail = existingVendorDetails;
        }



        await _dbContext.Vendor_Fax.AddAsync(Fax);
        await _dbContext.SaveChangesAsync();

        return new Vendor_Fax[] { Fax };
    }
    public async Task<Vendor_Vat[]> AddVatAsync(Vendor_Vat VAT)
    {
            Vendor_Detail existingVendorDetails = await _dbContext.Vendor_Detail.FirstOrDefaultAsync(x => x.Vendor_Detail_ID == VAT.Vendor_Detail_ID); ;

            if (existingVendorDetails != null)
            {
                VAT.Vendor_Detail = existingVendorDetails;
            }



            await _dbContext.Vendor_Vat.AddAsync(VAT);
            await _dbContext.SaveChangesAsync();

            return new Vendor_Vat[] { VAT };
        }

    public async Task<Vendor_Website[]> AddWebsiteAsync(Vendor_Website Website)
    {
            Vendor_Detail existingVendorDetails = await _dbContext.Vendor_Detail.FirstOrDefaultAsync(x => x.Vendor_Detail_ID == Website.Vendor_Detail_ID); ;

            if (existingVendorDetails != null)
            {
                Website.Vendor_Detail = existingVendorDetails;
            }



            await _dbContext.Vendor_Website.AddAsync(Website);
            await _dbContext.SaveChangesAsync();

            return new Vendor_Website[] { Website };
        }

    public async Task<Vendor_License[]> AddLicenseAsync(Vendor_License License)
    {
            Vendor_Detail existingVendorDetails = await _dbContext.Vendor_Detail.FirstOrDefaultAsync(x => x.Vendor_Detail_ID == License.Vendor_Detail_ID); ;

            if (existingVendorDetails != null)
            {
                License.Vendor_Detail = existingVendorDetails;
            }



            await _dbContext.Vendor_License.AddAsync(License);
            await _dbContext.SaveChangesAsync();

            return new Vendor_License[] { License };
        }

    public async Task<Vendor_Agreement[]> AddAgreementAsync(Vendor_Agreement Agreement)
    {
            Vendor_Detail existingVendorDetails = await _dbContext.Vendor_Detail.FirstOrDefaultAsync(x => x.Vendor_Detail_ID == Agreement.Vendor_Detail_ID); ;

            if (existingVendorDetails != null)
            {
                Agreement.Vendor_Detail = existingVendorDetails;
            }



            await _dbContext.Vendor_Agreement.AddAsync(Agreement);
            await _dbContext.SaveChangesAsync();

            return new Vendor_Agreement[] { Agreement };
        }

    public async Task<Vendor_Insurance[]> AddInsuranceAsync(Vendor_Insurance Insurance)
    {
            Vendor_Detail existingVendorDetails = await _dbContext.Vendor_Detail.FirstOrDefaultAsync(x => x.Vendor_Detail_ID == Insurance.Vendor_Detail_ID); ;

            if (existingVendorDetails != null)
            {
                Insurance.Vendor_Detail = existingVendorDetails;
            }



            await _dbContext.Vendor_Insurance.AddAsync(Insurance);
            await _dbContext.SaveChangesAsync();

            return new Vendor_Insurance[] { Insurance };
        }

    public async Task<Vendor_Payment_Terms[]> AddPayTermsAsync(Vendor_Payment_Terms PayTerms)
    {
            Vendor_Detail existingVendorDetails = await _dbContext.Vendor_Detail.FirstOrDefaultAsync(x => x.Vendor_Detail_ID == PayTerms.Vendor_Detail_ID); ;

            if (existingVendorDetails != null)
            {
                PayTerms.Vendor_Detail = existingVendorDetails;
            }



            await _dbContext.Vendor_Payment_Terms.AddAsync(PayTerms);
            await _dbContext.SaveChangesAsync();

            return new Vendor_Payment_Terms[] { PayTerms };
        }

    public async Task<Vendor_Registration[]> AddRegisteredAsync(Vendor_Registration Registered)
    {
            Vendor_Detail existingVendorDetails = await _dbContext.Vendor_Detail.FirstOrDefaultAsync(x => x.Vendor_Detail_ID == Registered.Vendor_Detail_ID); ;

            if (existingVendorDetails != null)
            {
                Registered.Vendor_Detail = existingVendorDetails;
            }



            await _dbContext.Vendor_Registration.AddAsync(Registered);
            await _dbContext.SaveChangesAsync();

            return new Vendor_Registration[] { Registered };
        }
    public async Task<Vendor_Tax[]> AddIncomeTaxAsync(Vendor_Tax IncomeTax)
       {
           Vendor_Detail existingVendorDetails = await _dbContext.Vendor_Detail.FirstOrDefaultAsync(x => x.Vendor_Detail_ID == IncomeTax.Vendor_Detail_ID); ;

           if (existingVendorDetails != null)
           {
                IncomeTax.Vendor_Detail = existingVendorDetails;
           }



           await _dbContext.Vendor_Tax.AddAsync(IncomeTax);
           await _dbContext.SaveChangesAsync();

           return new Vendor_Tax[] { IncomeTax };
       }
        //put

        public async Task<Vendor_Fax> UpdateFaxAsync(int FaxID, Vendor_Fax Fax)
        { 
            var VenFax = await _dbContext.Vendor_Fax.FirstOrDefaultAsync(x => x.Fax_ID == FaxID);


            VenFax.Vendor_Detail = new Vendor_Detail();

            Vendor_Detail existingVenDetail = await _dbContext.Vendor_Detail.FirstOrDefaultAsync(x => x.Vendor_Detail_ID == Fax.Vendor_Detail_ID);

            VenFax.Vendor_Detail = existingVenDetail;

            VenFax.Fax = Fax.Fax;  

            await _dbContext.SaveChangesAsync();

            return VenFax;
        }

        public async Task<Vendor_Website> UpdateWebsiteAsync(int WebsiteID, Vendor_Website Website)
        {
            var VenWebsite = await _dbContext.Vendor_Website.FirstOrDefaultAsync(x => x.Website_ID == WebsiteID);


            VenWebsite.Vendor_Detail = new Vendor_Detail();

            Vendor_Detail existingVenDetail = await _dbContext.Vendor_Detail.FirstOrDefaultAsync(x => x.Vendor_Detail_ID == Website.Vendor_Detail_ID);

            VenWebsite.Vendor_Detail = existingVenDetail;

            VenWebsite.URL = Website.URL;

            await _dbContext.SaveChangesAsync();

            return VenWebsite;
        }

        public async Task<Vendor_License> UpdateLicenseAsync(int LicenseID, Vendor_License License)
        {
            var VenLicense = await _dbContext.Vendor_License.FirstOrDefaultAsync(x => x.Vendor_Detail_ID == License.Vendor_Detail_ID);


            VenLicense.Vendor_Detail = new Vendor_Detail();

            Vendor_Detail existingVenDetail = await _dbContext.Vendor_Detail.FirstOrDefaultAsync(x => x.Vendor_Detail_ID == License.Vendor_Detail_ID);

            VenLicense.Vendor_Detail = existingVenDetail;

           // VenLicense.License_No = License.License_No;
            VenLicense.License_Doc_Upload = License.License_Doc_Upload; 


            await _dbContext.SaveChangesAsync();

            return VenLicense;
        }

        public async Task<Vendor_Insurance> UpdateInsuranceAsync(int InsuranceID, Vendor_Insurance Insurance)
        {
            var VenInsurance = await _dbContext.Vendor_Insurance.FirstOrDefaultAsync(x => x.Insurance_ID == InsuranceID);


            VenInsurance.Vendor_Detail = new Vendor_Detail();

            Vendor_Detail existingVenDetail = await _dbContext.Vendor_Detail.FirstOrDefaultAsync(x => x.Vendor_Detail_ID == Insurance.Vendor_Detail_ID);

            VenInsurance.Vendor_Detail = existingVenDetail;

            VenInsurance.Confirmation_Doc = Insurance.Confirmation_Doc;

            await _dbContext.SaveChangesAsync();

            return VenInsurance;
        }

        public async Task<Vendor_Payment_Terms> UpdatePayTermsAsync(int PaymentTermsID, Vendor_Payment_Terms PayTerms)
        {
            var VenPayTerms = await _dbContext.Vendor_Payment_Terms.FirstOrDefaultAsync(x => x.Payment_Terms_ID == PaymentTermsID);


            VenPayTerms.Vendor_Detail = new Vendor_Detail();

            Vendor_Detail existingVenDetail = await _dbContext.Vendor_Detail.FirstOrDefaultAsync(x => x.Vendor_Detail_ID == PayTerms.Vendor_Detail_ID);

            VenPayTerms.Vendor_Detail = existingVenDetail;

            VenPayTerms.Payment_Terms = PayTerms.Payment_Terms;

            await _dbContext.SaveChangesAsync();

            return VenPayTerms;
        }

        public async Task<Vendor_Agreement> UpdateAgreementAsync(int AgreementID, Vendor_Agreement Agreement)
        {
            var VenAgreement = await _dbContext.Vendor_Agreement.FirstOrDefaultAsync(x => x.Agreement_ID == AgreementID);


            VenAgreement.Vendor_Detail = new Vendor_Detail();

            Vendor_Detail existingVenDetail = await _dbContext.Vendor_Detail.FirstOrDefaultAsync(x => x.Vendor_Detail_ID == Agreement.Vendor_Detail_ID);

            VenAgreement.Vendor_Detail = existingVenDetail;

            VenAgreement.Signed_Agreement_Doc = Agreement.Signed_Agreement_Doc;

            await _dbContext.SaveChangesAsync();

            return VenAgreement;
        }

        public async Task<Vendor_Registration> UpdateRegisteredAsync(int RegistrationID, Vendor_Registration Registered)
        {


            var VenRegistered = await _dbContext.Vendor_Registration.FirstOrDefaultAsync(x => x.Vendor_Detail_ID == RegistrationID);

            

            VenRegistered.Vendor_Detail = new Vendor_Detail();

            Vendor_Detail existingVenDetail = await _dbContext.Vendor_Detail.FirstOrDefaultAsync(x => x.Vendor_Detail_ID == RegistrationID);

            VenRegistered.Vendor_Detail = existingVenDetail;

           

           // VenRegistered.Company_Registration_Number = Registered.Company_Registration_Number;
            VenRegistered.Proof_Of_Registration_Doc = Registered.Proof_Of_Registration_Doc;

            await _dbContext.SaveChangesAsync();

            return VenRegistered;
        }

        public async Task<Vendor_Vat> UpdateVatAsync(int VatID, Vendor_Vat VAT)
        {
            var VenVAT = await _dbContext.Vendor_Vat.FirstOrDefaultAsync(x => x.Vendor_Detail_ID == VAT.Vendor_Detail_ID);


            VenVAT.Vendor_Detail = new Vendor_Detail();

            Vendor_Detail existingVenDetail = await _dbContext.Vendor_Detail.FirstOrDefaultAsync(x => x.Vendor_Detail_ID == VAT.Vendor_Detail_ID);

            VenVAT.Vendor_Detail = existingVenDetail;

           // VenVAT.Vat_Registration_Number = VAT.Vat_Registration_Number;
            VenVAT.VAT_Registration_Document = VAT.VAT_Registration_Document;

            await _dbContext.SaveChangesAsync();

            return VenVAT;
        }

        public async Task<Vendor_Tax> UpdateIncomeTaxAsync(int IncomeTaxID, Vendor_Tax IncomeTax)
        {
            var VenIncomeTax = await _dbContext.Vendor_Tax.FirstOrDefaultAsync(x => x.Vendor_Detail_ID == IncomeTax.Vendor_Detail_ID);


            VenIncomeTax.Vendor_Detail = new Vendor_Detail();

            Vendor_Detail existingVenDetail = await _dbContext.Vendor_Detail.FirstOrDefaultAsync(x => x.Vendor_Detail_ID == IncomeTax.Vendor_Detail_ID);

            VenIncomeTax.Vendor_Detail = existingVenDetail;

            //VenIncomeTax.Income_Tax_Num = IncomeTax.Income_Tax_Num;
            VenIncomeTax.Tax_Clearance_Cert = IncomeTax.Tax_Clearance_Cert;

            await _dbContext.SaveChangesAsync();

            return VenIncomeTax;
        }

           public async Task<Vendor_Fax> DeleteFaxByIDAsync(int FaxID)
        {
            var RequestToDelete = await _dbContext.Vendor_Fax.FirstOrDefaultAsync(x => x.Fax_ID == FaxID);
            _dbContext.Vendor_Fax.Remove(RequestToDelete);
            await _dbContext.SaveChangesAsync();

            return RequestToDelete;
        }
        public async Task<Vendor_Vat> DeleteVatByIDAsync(int VatID)
        {
            var RequestToDelete = await _dbContext.Vendor_Vat.FirstOrDefaultAsync(x => x.Vendor_Detail_ID == VatID);
            _dbContext.Vendor_Vat.Remove(RequestToDelete);
            await _dbContext.SaveChangesAsync();

            return RequestToDelete;
        }

        public async Task<Vendor_Website> DeleteWebsiteByIDAsync(int WebsiteID)
        {
            var RequestToDelete = await _dbContext.Vendor_Website.FirstOrDefaultAsync(x => x.Website_ID == WebsiteID);
            _dbContext.Vendor_Website.Remove(RequestToDelete);
            await _dbContext.SaveChangesAsync();

            return RequestToDelete; ;
        }

        public async Task<Vendor_License> DeleteLicenseByIDAsync(int LicenseID)
        {
            var RequestToDelete = await _dbContext.Vendor_License.FirstOrDefaultAsync(x => x.Vendor_Detail_ID == LicenseID);
            _dbContext.Vendor_License.Remove(RequestToDelete);
            await _dbContext.SaveChangesAsync();

            return RequestToDelete;
        }

        public async Task<Vendor_Agreement> DeleteAgreementByIDAsync(int AgreementID)
        {
            var RequestToDelete = await _dbContext.Vendor_Agreement.FirstOrDefaultAsync(x => x.Agreement_ID == AgreementID);
            _dbContext.Vendor_Agreement.Remove(RequestToDelete);
            await _dbContext.SaveChangesAsync();

            return RequestToDelete;
        }

        public async Task<Vendor_Insurance> DeleteInsuranceByIDAsync(int InsuranceID)
        {
            var RequestToDelete = await _dbContext.Vendor_Insurance.FirstOrDefaultAsync(x => x.Insurance_ID == InsuranceID);
            _dbContext.Vendor_Insurance.Remove(RequestToDelete);
            await _dbContext.SaveChangesAsync();

            return RequestToDelete;
        }

        public async Task<Vendor_Payment_Terms> DeletePaymentTermsAsync(int PaymentTermsID)
        {
            var RequestToDelete = await _dbContext.Vendor_Payment_Terms.FirstOrDefaultAsync(x => x.Payment_Terms_ID == PaymentTermsID);
            _dbContext.Vendor_Payment_Terms.Remove(RequestToDelete);
            await _dbContext.SaveChangesAsync();

            return RequestToDelete;
        }

        public async Task<Vendor_Registration> DeleteRegistrationByIDAsync(int RegistrationID)
        {
            var RequestToDelete = await _dbContext.Vendor_Registration.FirstOrDefaultAsync(x => x.Vendor_Detail_ID == RegistrationID);
            _dbContext.Vendor_Registration.Remove(RequestToDelete);
            await _dbContext.SaveChangesAsync();

            return RequestToDelete; ;
        }

        public async Task<Vendor_Tax> DeleteIncomeTaxByIDDAsync(int IncomeTaxID)
        {
            var RequestToDelete = await _dbContext.Vendor_Tax.FirstOrDefaultAsync(x => x.Vendor_Detail_ID == IncomeTaxID);
            _dbContext.Vendor_Tax.Remove(RequestToDelete);
            await _dbContext.SaveChangesAsync();

            return RequestToDelete;
        }



        //Validation

        public async Task<Vendor_Vat> VatRegNumberValAsync(string vatNumber)
        {
            Vendor_Vat ExistingVat = await _dbContext.Vendor_Vat.FirstOrDefaultAsync(x => x.Vat_Registration_Number == vatNumber);
            if (ExistingVat != null)
            {
                return ExistingVat;
            }

            else
            {
                return null;
            }
        }

        public async Task<Vendor_Tax> IncomeTaxRegNumberValAsync(string IncomeTaxNumber)
        {
            Vendor_Tax ExistingTax = await _dbContext.Vendor_Tax.FirstOrDefaultAsync(x => x.Income_Tax_Num == IncomeTaxNumber);
            if (ExistingTax != null)
            {
                return ExistingTax;
            }

            else
            {
                return null;
            }
        }

        public async Task<Vendor_Registration> CompanyRegNumberValAsync(string CompanyRegNumber)
        {
            Vendor_Registration ExistingCompanyReg = await _dbContext.Vendor_Registration.FirstOrDefaultAsync(x => x.Company_Registration_Number == CompanyRegNumber);
            if (ExistingCompanyReg != null)
            {
                return ExistingCompanyReg;
            }

            else
            {
                return null;
            }
        }

        public async Task<Vendor_License> LicenseNumberValAsync(string LicenseNumber)
        {
            Vendor_License ExistingLicense = await _dbContext.Vendor_License.FirstOrDefaultAsync(x => x.License_No == LicenseNumber);
            if (ExistingLicense != null)
            {
                return ExistingLicense;
            }

            else
            {
                return null;
            }
        }

    }
}
