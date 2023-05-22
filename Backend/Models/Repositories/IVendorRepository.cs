using Azure.Core;
using ProcionAPI.Models.Entities;
using ProcionAPI.ViewModel;

namespace ProcionAPI.Models.Repositories
{
    public interface IVendorRepository
    {
        Task<Vendor_Detail[]> GetAllVendorDetailstAsync();
        Task<Vendor_Detail> GetVendorDetailByIDAsync(int VendorDetailID);
        Task<Vendor[]> getAllApprovedVendorsAsync();
        Task<Vendor> GetVendorByIDAsync(int VendorID);
        Task<Vendor_Detail[]> AddVendorDetailsAsync(Vendor_Detail VenDetails);
        Task<Vendor_Detail> UpdateVendorDetailsAsync(int VendorDetailsID, Vendor_Detail VenDetails);
        Task<Vendor_Detail> DeleteVendorDetailsAsync(int VendorDetailsID);

        Task<Vendor> UpdateVendorStatusAsync(int VendorID, int VendorStatusID);
        ///
        Task<Vendor_Fax> GetFaxByIDAsync(int FaxID);
        Task<Vendor_Vat> GetVatByIDAsync(int VatID);
        Task<Vendor_Website> GetWebsiteByIDAsync(int WebsiteID);
        Task<Vendor_License> GetLicenseByIDAsync(int LicenseID);
        Task<Vendor_Agreement> GetAgreementByIDAsync(int AgreementID);
        Task<Vendor_Insurance> GetInsuranceByIDAsync(int InsuranceID);
        Task<Vendor_Payment_Terms> GetPaymentTermsAsync(int PaymentTermsID);
        Task<Vendor_Registration> GetRegistrationByIDAsync(int RegistrationID);
        Task<Vendor_Tax> GetIncomeTaxByIDAsync(int IncomeTaxID);
        ///
        Task<Vendor_Fax[]> AddFaxAsync(Vendor_Fax Fax);
        Task<Vendor_Vat[]> AddVatAsync(Vendor_Vat VAT);
        Task<Vendor_Website[]> AddWebsiteAsync(Vendor_Website Website);
        Task<Vendor_License[]> AddLicenseAsync(Vendor_License License);
        Task<Vendor_Agreement[]> AddAgreementAsync(Vendor_Agreement Agreement);
        Task<Vendor_Insurance[]> AddInsuranceAsync(Vendor_Insurance Insurance);
        Task<Vendor_Payment_Terms[]> AddPayTermsAsync(Vendor_Payment_Terms PayTerms);
        Task<Vendor_Registration[]> AddRegisteredAsync(Vendor_Registration Registered);
        Task<Vendor_Tax[]> AddIncomeTaxAsync(Vendor_Tax IncomeTax);
        ////

        Task<Vendor_Fax> UpdateFaxAsync(int FaxID, Vendor_Fax Fax);
        Task<Vendor_Website> UpdateWebsiteAsync(int WebsiteID, Vendor_Website Website);
        Task<Vendor_License> UpdateLicenseAsync(int LicenseID, Vendor_License License);
        Task<Vendor_Insurance> UpdateInsuranceAsync(int InsuranceID, Vendor_Insurance Insurance);
        Task<Vendor_Payment_Terms> UpdatePayTermsAsync(int PaymentTermsID, Vendor_Payment_Terms PayTerms);
        Task<Vendor_Agreement> UpdateAgreementAsync(int AgreementID, Vendor_Agreement Agreement);
        Task<Vendor_Registration> UpdateRegisteredAsync(int RegistrationID, Vendor_Registration Registered);
        Task<Vendor_Vat> UpdateVatAsync(int VatID, Vendor_Vat VAT);
        Task<Vendor_Tax> UpdateIncomeTaxAsync(int IncomeTaxID, Vendor_Tax IncomeTax);

        ///
        ///
        Task<Vendor_Fax> DeleteFaxByIDAsync(int FaxID);
        Task<Vendor_Vat> DeleteVatByIDAsync(int VatID);
        Task<Vendor_Website> DeleteWebsiteByIDAsync(int WebsiteID);
        Task<Vendor_License> DeleteLicenseByIDAsync(int LicenseID);
        Task<Vendor_Agreement> DeleteAgreementByIDAsync(int AgreementID);
        Task<Vendor_Insurance> DeleteInsuranceByIDAsync(int InsuranceID);
        Task<Vendor_Payment_Terms> DeletePaymentTermsAsync(int PaymentTermsID);
        Task<Vendor_Registration> DeleteRegistrationByIDAsync(int RegistrationID);
        Task<Vendor_Tax> DeleteIncomeTaxByIDDAsync(int IncomeTaxID);
        ///
        //validation
        Task<Vendor_Vat> VatRegNumberValAsync(string vatNumber);
        Task<Vendor_Tax> IncomeTaxRegNumberValAsync(string IncomeTaxNumber);
        Task<Vendor_Registration> CompanyRegNumberValAsync(string CompanyRegNumber);
        Task<Vendor_License> LicenseNumberValAsync(string LicenseNumber);
    }
}
