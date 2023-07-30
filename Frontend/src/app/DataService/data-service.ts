import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Cons, map, Observable, Subject } from 'rxjs';
import { Consumable } from '../Shared/Consumable';
import { Role } from '../Shared/EmployeeRole';
import { Employee } from '../Shared/Employee';
import { ConsumableCategory } from '../Shared/ConsumableCategory';
import { Help } from '../Shared/Help';
import { Help_Category } from '../Shared/HelpCategory';
import { Branch } from '../Shared/Branch';
import { Department } from '../Shared/Department';
import { User } from '../Shared/User';
import { Admin } from '../Shared/Admin';
import { Mandate_Limit } from '../Shared/MandateLimit';
import { OnboardRequest } from '../Shared/OnboardRequest';
import { VendorOnboardRequestVM } from '../Shared/VendorOnboardRequestVM';
import { VendorOnboardRequest } from '../Shared/VendorOnboardRequest';
import { VendorDetails } from '../Shared/VendorDetails';
import { Vendor_Vat } from '../Shared/VendorDetailsVatRegistered';
import { Vendor_Website } from '../Shared/VendorDetailsWebsite';
import { Vendor_License } from '../Shared/VendorDetailsLicense';
import { Vendor_Agreement } from '../Shared/VendorDetailsSignedAgreement';
import { Vendor_Insurance } from '../Shared/VendorDetailsInsurance';
import { Vendor_Payment_Terms } from '../Shared/VendorDetailsPaymentTerms';
import { Vendor_Registration } from '../Shared/VendorDetailsRegistration';
import { Vendor_Fax } from '../Shared/VendorDetailsFax';
import { Vendor_Tax } from '../Shared/VendorDetailsIncomeTaxNum';
import { MailData } from '../Shared/Mail';
import { BudgetCategory } from '../Shared/BudgetCategory';
import { BudgetAllocation } from '../Shared/BudgetAllocation';
import { BudgetLine } from '../Shared/BudgetLine';
import { SoleSupplier } from '../Shared/Sole_Supplier';
import * as moment from 'moment'
import { Consumable_History } from '../Shared/Consumable_History';
import { Delegation_Of_Authority } from '../Shared/DelegationOfAuthority';
import { DelegationStatus } from '../Shared/DelegationStatus';
import { Temporary_Access } from '../Shared/Temporary_Access';
import { Due_Dillegence } from '../Shared/DueDillegence';
import { Vendor_BEE } from '../Shared/VendorBEE';
import { POPI } from '../Shared/POPI';
import { Notification_Type } from '../Shared/Notification_Type';
import { Notification } from '../Shared/Notification';

import { Procurement_Request } from '../Shared/Procurement_Request';
import { Procurement_Request_Quote } from '../Shared/Procurement_Request_Quote';
import { Procurement_Details } from '../Shared/ProcurementDetails';
import { Deposit } from '../Shared/Deposit';
import { Payment_Made } from '../Shared/PaymentMade';
import { Proof_Of_Payment } from '../Shared/ProofOfPayment';
import { Procurement_Consumable } from '../Shared/Procurement_Consumable';
import { Vendor_Consumable } from '../Shared/Vendor_Consumable';
import { Asset } from '../Shared/Asset';
import { Procurement_Asset } from '../Shared/Procurement_Asset';
import { Vendor_Asset } from '../Shared/Vendor_Asset';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  apiUrl = 'https://localhost:7186/api/'

  httpOptions = {
    headers: new HttpHeaders({
      ContentType: 'application/json'
    })
  }

  constructor(private httpClient: HttpClient) { }
  //--------------------------------------------------------------------------------------Consumables--------------------------------------------------------------------------------------
  GetConsumables(): Observable<any> {
    return this.httpClient.get<Consumable[]>(`${this.apiUrl}Consumable/GetConsumables`).pipe(map(result => result))
  }

  GetConsumableByID(consumableID: Number): Observable<Consumable> {
    console.log(consumableID)
    return this.httpClient.get<Consumable>(`${this.apiUrl}Consumable/GetConsumableByID/` + consumableID, this.httpOptions)
  }

  AddConsumables(AddConsumableRequest: Consumable) {
    return this.httpClient.post<Consumable>(`${this.apiUrl}Consumable/CreateConsumable`, AddConsumableRequest).pipe(map(result => result))
  }

  UpdateConsumable(consumableID: Number, UpdateConsumableRequest: Consumable): Observable<Consumable> {
    return this.httpClient.put<Consumable>(`${this.apiUrl}Consumable/UpdateConsumable/` + consumableID, UpdateConsumableRequest, this.httpOptions)
  }

  DeleteConsumable(ConsumableID: Number): Observable<Consumable> {
    return this.httpClient.delete<Consumable>(`${this.apiUrl}Consumable/DeleteConsumable/` + ConsumableID, this.httpOptions)
  }

  ConsumableValidation(name: String, category: String): Observable<Consumable> {
    return this.httpClient.get<Consumable>(`${this.apiUrl}Consumable/ConsumableValidation/` + name + "/" + category, this.httpOptions)
  }

  //--------------------------------------------------------------------------------------Consumable Categories--------------------------------------------------------------------------------------
  GetCategories() {
    return this.httpClient.get<ConsumableCategory[]>(`${this.apiUrl}ConsumableCategory/GetConsumableCategories`).pipe(map(result => result))
  }

  GetCategoryByID(categoryID: Number): Observable<ConsumableCategory> {
    return this.httpClient.get<ConsumableCategory>(`${this.apiUrl}ConsumableCategory/GetConsumableCategoryByID/` + categoryID, this.httpOptions)
  }

  CreateCategory(AddCategoryRequest: ConsumableCategory) {
    return this.httpClient.post<ConsumableCategory>(`${this.apiUrl}ConsumableCategory/CreateCategory`, AddCategoryRequest).pipe(map(result => result))
  }

  UpdateCategory(CategoryID: Number, UpdateCategoryRequest: ConsumableCategory): Observable<ConsumableCategory> {
    return this.httpClient.put<ConsumableCategory>(`${this.apiUrl}ConsumableCategory/UpdateConsumableCategory/` + CategoryID, UpdateCategoryRequest, this.httpOptions)
  }

  DeleteCategory(CategoryID: Number): Observable<ConsumableCategory> {
    return this.httpClient.delete<ConsumableCategory>(`${this.apiUrl}ConsumableCategory/DeleteCategory/` + CategoryID, this.httpOptions)
  }
  CategoryValidation(name: String): Observable<ConsumableCategory> {
    return this.httpClient.get<ConsumableCategory>(`${this.apiUrl}ConsumableCategory/CategoryValidation/` + name, this.httpOptions)
  }

  //--------------------------------------------------------------------------------------Branch--------------------------------------------------------------------------------------
  GetBranches(): Observable<any> {
    return this.httpClient.get<Branch[]>(`${this.apiUrl}Branch/GetBranches`).pipe(map(result => result))
  }

  GetBranch(Branch_ID: Number) {
    return this.httpClient.get(`${this.apiUrl}Branch/GetBranch/` + Branch_ID).pipe(map(result => result))
  }

  AddBranch(AddBranchRequest: Branch) {
    return this.httpClient.post<Branch>(`${this.apiUrl}Branch/CreateBranch`, AddBranchRequest, this.httpOptions)
  }

  DeleteBranch(Branch_ID: Number): Observable<Branch> {
    return this.httpClient.delete<Branch>(`${this.apiUrl}Branch/DeleteBranch` + '/' + Branch_ID, this.httpOptions)
  }

  EditBranch(branch_ID: Number, UpdateBranchRequest: Branch): Observable<Branch> {
    return this.httpClient.put<Branch>(`${this.apiUrl}Branch/EditBranch/${branch_ID}`, UpdateBranchRequest, this.httpOptions)
  }

  BranchValidation(name: String): Observable<Branch> {
    return this.httpClient.get<Branch>(`${this.apiUrl}Branch/BranchValidation/` + name, this.httpOptions)
  }
  EditBranchValidation(name: String, id: Number): Observable<Branch> {
    return this.httpClient.get<Branch>(`${this.apiUrl}Branch/EditBranchValidation/` + name + '/' + id, this.httpOptions)
  }


  //--------------------------------------------------------------------------------------Department--------------------------------------------------------------------------------------
  GetDepartments(): Observable<any> {
    return this.httpClient.get<Department[]>(`${this.apiUrl}Department/GetDepartments`).pipe(map(result => result))
  }

  GetDepartment(Department_ID: number) {
    return this.httpClient.get(`${this.apiUrl}Department/GetDepartment` + '/' + Department_ID).pipe(map(result => result))
  }

  AddDepartments(AddDepartmentRequest: Department) {
    return this.httpClient.post<Department>(`${this.apiUrl}Department/CreateDepartment`, AddDepartmentRequest, this.httpOptions)
  }

  DeleteDepartment(Department_ID: Number): Observable<Department> {
    return this.httpClient.delete<Department>(`${this.apiUrl}Department/DeleteDepartment` + '/' + Department_ID, this.httpOptions)
  }

  EditDepartment(department_ID: number, UpdateDepartmentRequest: Department) {
    return this.httpClient.put<Department>(`${this.apiUrl}Department/EditDepartment/` + department_ID, UpdateDepartmentRequest, this.httpOptions)
  }

  DepartmentValidation(name: String): Observable<Department> {
    return this.httpClient.get<Department>(`${this.apiUrl}Department/DepartmentValidation/` + name, this.httpOptions)
  }
  EditDepartmentValidation(name: String, id: Number): Observable<Department> {
    return this.httpClient.get<Department>(`${this.apiUrl}Department/EditDepartmentValidation/` + name + '/' + id, this.httpOptions)
  }

  //--------------------------------------------------------------------------------------Help And Help Files--------------------------------------------------------------------------------------
  GetHelps(): Observable<any> {
    return this.httpClient.get<Help[]>(`${this.apiUrl}Help/GetHelps`).pipe(map(result => result))
  }
  GetHelpCategorys(): Observable<any> {
    return this.httpClient.get<Help_Category[]>(`${this.apiUrl}Help/GetHelpCategorys`).pipe(map(result => result))
  }

  GetHelp(Help_ID: number) {
    return this.httpClient.get(`${this.apiUrl}Help/GetHelp` + '/' + Help_ID).pipe(map(result => result))
  }

  AddHelps(AddHelp: Help) {
    return this.httpClient.post(`${this.apiUrl}Help/CreateHelp`, AddHelp, this.httpOptions)
  }

  DeleteHelp(Help_ID: Number): Observable<Help> {
    return this.httpClient.delete<Help>(`${this.apiUrl}Help/DeleteHelp` + '/' + Help_ID, this.httpOptions)
  }

  EditHelp(UpdateHelpRequest: Help, help_ID: number): Observable<Help> {
    return this.httpClient.put<Help>(`${this.apiUrl}Help/EditHelp/` + help_ID, UpdateHelpRequest, this.httpOptions)
  }

  HelpValidation(name: String): Observable<Help> {
    return this.httpClient.get<Help>(`${this.apiUrl}Help/HelpValidation/` + name , this.httpOptions)
  }
  EditHelpValidation(name: String, id: Number): Observable<Help> {
    return this.httpClient.get<Help>(`${this.apiUrl}Help/EditHelpValidation/` + name + '/' + id, this.httpOptions)
  }

  DeleteHelpFile(HelpName: string, fileName: string): Observable<any> {
    return this.httpClient.delete<any>(`${this.apiUrl}Help/DeleteHelpFile/${HelpName}/${fileName}`, this.httpOptions)
  }

  HelpFileAdd(HelpName: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('HelpName', HelpName)
    return this.httpClient.post<any>(`${this.apiUrl}Help/uploadHelpFile`, formData, this.httpOptions)
  }


  GetHelpPDFFiles(HelpName: string, filename: string): Observable<any> {
    return this.httpClient.post<any>(`${this.apiUrl}Help/GetHelpPDFFiles/${HelpName}/${filename}`, this.httpOptions)
  }

  GetHelpVideoFiles(HelpName: string, filename: string): Observable<any> {
    return this.httpClient.post<any>(`${this.apiUrl}Help/GetHelpVideoFiles/${HelpName}/${filename}`, this.httpOptions)
  }

   //----------------------------------------------------------------------Backup&Restore-----------------------------------------------------------------------------
   createBackup(): Observable<any> {
    return this.httpClient.post<any>(`${this.apiUrl}Backup/CreateBackup`, this.httpOptions);
  }
  restoreDatabase(backupFile: File): Observable<any> {
    const formData = new FormData();
    formData.append('backupFile', backupFile, backupFile.name);
    return this.httpClient.post<any>(`${this.apiUrl}Backup/restore`, formData, { reportProgress: true, observe: 'events' });
  }
  //--------------------------------------------------------------------------------------Requests--------------------------------------------------------------------------------------

  GetAllOnboardRequest(): Observable<any> {
    return this.httpClient.get<VendorOnboardRequestVM[]>(`${this.apiUrl}OnboardRequest/GetAllOnboardRequest`).pipe(map(result => result))
  }

  AddOnboardRequest(AddRequest: OnboardRequest) {
    return this.httpClient.post<OnboardRequest[]>(`${this.apiUrl}OnboardRequest/CreateOnboardRequest`, AddRequest, this.httpOptions)
  }

  GetVendorsRequest() {
    return this.httpClient.get<VendorOnboardRequest[]>(`${this.apiUrl}OnboardRequest/GetAllVendor`).pipe(map(result => result))
  }

  GetRequestByID(RequestID: number): Observable<any> {
    return this.httpClient.get<OnboardRequest[]>(`${this.apiUrl}OnboardRequest/GetRequest/${RequestID}`, this.httpOptions).pipe(map(result => result))
  }

  UpdateOnboardRequest(RequestID: number, UpdatedRequest: OnboardRequest,): Observable<OnboardRequest> {
    return this.httpClient.put<OnboardRequest>(`${this.apiUrl}OnboardRequest/UpdateOnboardRequest/${RequestID}`, UpdatedRequest, this.httpOptions)
  }

  DeleteRequest(RequestId: number, VendorID: number): Observable<any> {
    return this.httpClient.delete<OnboardRequest>(`${this.apiUrl}OnboardRequest/DeleteRequest/${RequestId}/${VendorID}`, this.httpOptions)
  }

  AddSoleSupplierDetails(VendorID: number, soleSupplier: SoleSupplier) {
    return this.httpClient.post(`${this.apiUrl}OnboardRequest/AddSoleSupplierDetails/${VendorID}`, soleSupplier, this.httpOptions)
  }

  GetSoleSupplierByID(VendorID: number): Observable<any> {
    return this.httpClient.get<OnboardRequest[]>(`${this.apiUrl}OnboardRequest/GetSoleSupplierByID/${VendorID}`, this.httpOptions).pipe(map(result => result))
  }

  UpdateSoleSupplier(SoleSupplierID: number, UpdatedSoleSupplier: SoleSupplier): Observable<SoleSupplier> {
    return this.httpClient.put<SoleSupplier>(`${this.apiUrl}OnboardRequest/UpdateSoleSupplier/${SoleSupplierID}`, UpdatedSoleSupplier, this.httpOptions)
  }

  GetVendorValidation(sVendorName: string): Observable<any> {
    return this.httpClient.get<OnboardRequest[]>(`${this.apiUrl}OnboardRequest/GetVendorValidation/${sVendorName}`, this.httpOptions).pipe(map(result => result))
  }

  DeleteSoleSupplier(VendorID: number): Observable<any> {
    return this.httpClient.delete<SoleSupplier>(`${this.apiUrl}OnboardRequest/DeleteSoleSupplier/${VendorID}`, this.httpOptions)
  }

  DeleteVendor(VendorID: number): Observable<any> {
    return this.httpClient.delete<VendorOnboardRequest>(`${this.apiUrl}OnboardRequest/DeleteVendor/${VendorID}`, this.httpOptions)
  }

  //--------------------------------------------------------------------------------------Request Files--------------------------------------------------------------------------------------

  DeleteFile(RequestNo: string, fileName: string): Observable<any> {
    return this.httpClient.delete<any>(`${this.apiUrl}OnboardRequest/DeleteFile/${RequestNo}/${fileName}`, this.httpOptions)
  }

  OnboardFileAdd(RequestNo: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('RequestNo', RequestNo)
    return this.httpClient.post<any>(`${this.apiUrl}OnboardRequest/uploadOnboardFile`, formData, this.httpOptions)
  }

  GetOnboardFiles(RequestNo: string, filename: string): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}OnboardRequest/GetOnboardFiles/${RequestNo}/${filename}`, { headers: new HttpHeaders({ ContentType: 'application/octet-stream' }), responseType: "blob" })
  }


  //--------------------------------------------------------------------------------------Vendor Details--------------------------------------------------------------------------------------
  GetAllVendorDetails(): Observable<any> {
    return this.httpClient.get<VendorDetails[]>(`${this.apiUrl}Vendor/GetAllVendorDetails`).pipe(map(result => result))
  }

  GetVendorDetailByID(VendorDetailID: number): Observable<any> {
    return this.httpClient.get<VendorDetails>(`${this.apiUrl}Vendor/GetVendorDetailByID/${VendorDetailID}`, this.httpOptions).pipe(map(result => result))
  }

  getAllApprovedVendors(): Observable<any> {
    return this.httpClient.get<VendorOnboardRequest[]>(`${this.apiUrl}Vendor/getAllApprovedVendors`).pipe(map(result => result))
  }

  GetVendorByID(VendorID: number): Observable<any> {
    return this.httpClient.get<VendorOnboardRequest>(`${this.apiUrl}Vendor/GetVendorByID/${VendorID}`).pipe(map(result => result))
  }

  AddVendorDetails(VenDetails: VendorDetails): Observable<any> {
    return this.httpClient.post<VendorDetails>(`${this.apiUrl}Vendor/AddVendorDetails`, VenDetails, this.httpOptions).pipe(map(result => result))
  }

  UpdateVendorDetails(VendorDetailsID: number, VenDetails: VendorDetails): Observable<VendorDetails> {
    return this.httpClient.put<VendorDetails>(`${this.apiUrl}Vendor/UpdateVendorDetails/${VendorDetailsID}`, VenDetails, this.httpOptions).pipe(map(result => result))
  }

  UpdateVendorStatus(VendorID: number, VendorStatusID: number): Observable<any> {
    return this.httpClient.put<VendorOnboardRequest>(`${this.apiUrl}Vendor/UpdateVendorStatus/${VendorID}/${VendorStatusID}`, this.httpOptions).pipe(map(result => result))
  }


  DeleteVendorDetails(vendorDetailsID: number): Observable<any> {
    return this.httpClient.delete<VendorDetails>(`${this.apiUrl}Vendor/DeleteVendorDetails/${vendorDetailsID}`, this.httpOptions).pipe(map(result => result))
  }

  //GetDifferentTables
  GetFaxByID(FaxID: number): Observable<any> {
    return this.httpClient.get<VendorDetails>(`${this.apiUrl}Vendor/GetFaxByID/${FaxID}`, this.httpOptions).pipe(map(result => result))
  }

  GetVatByID(VatID: number): Observable<any> {
    return this.httpClient.get<Vendor_Vat>(`${this.apiUrl}Vendor/GetVatByID/${VatID}`, this.httpOptions).pipe(map(result => result))
  }


  GetWebsiteByID(WebsiteID: number): Observable<any> {
    return this.httpClient.get<Vendor_Website>(`${this.apiUrl}Vendor/GetWebsiteByID/${WebsiteID}`, this.httpOptions).pipe(map(result => result))
  }

  GetLicenseByID(LicenseID: number): Observable<any> {
    return this.httpClient.get<Vendor_License>(`${this.apiUrl}Vendor/GetLicenseByID/${LicenseID}`, this.httpOptions).pipe(map(result => result))
  }

  GetAgreementByID(AgreementID: number): Observable<any> {
    return this.httpClient.get<Vendor_Agreement>(`${this.apiUrl}Vendor/GetAgreementByID/${AgreementID}`, this.httpOptions).pipe(map(result => result))
  }

  GetInsuranceByID(VendorID: number): Observable<any> {
    return this.httpClient.get<Vendor_Insurance[]>(`${this.apiUrl}Vendor/GetInsuranceByID/${VendorID}`, this.httpOptions).pipe(map(result => result))
  }

  GetPaymentTerms(PaymentTermsID: number): Observable<any> {
    return this.httpClient.get<Vendor_Payment_Terms>(`${this.apiUrl}Vendor/GetPaymentTerms/${PaymentTermsID}`, this.httpOptions).pipe(map(result => result))
  }

  GetRegistrationByID(RegistrationID: number): Observable<any> {
    return this.httpClient.get<Vendor_Registration>(`${this.apiUrl}Vendor/GetRegistrationByID/${RegistrationID}`, this.httpOptions).pipe(map(result => result))
  }

  GetIncomeTaxByID(IncomeTaxID: number): Observable<any> {
    return this.httpClient.get<Vendor_Tax>(`${this.apiUrl}Vendor/GetIncomeTaxByID/${IncomeTaxID}`, this.httpOptions).pipe(map(result => result))
  }

  //post
  AddFax(Fax: Vendor_Fax): Observable<any> {
    return this.httpClient.post<Vendor_Fax>(`${this.apiUrl}Vendor/AddFax`, Fax, this.httpOptions).pipe(map(result => result))
  }
  AddWebsite(Website: Vendor_Website): Observable<any> {
    return this.httpClient.post<Vendor_Website>(`${this.apiUrl}Vendor/AddWebsite`, Website, this.httpOptions).pipe(map(result => result))
  }
  AddLicense(License: Vendor_License): Observable<any> {
    return this.httpClient.post<Vendor_License>(`${this.apiUrl}Vendor/AddLicense`, License, this.httpOptions).pipe(map(result => result))
  }
  AddAgreement(Agreement: Vendor_Agreement): Observable<any> {
    return this.httpClient.post<Vendor_Agreement>(`${this.apiUrl}Vendor/AddAgreement`, Agreement, this.httpOptions).pipe(map(result => result))
  }
  AddInsurance(Insurance: Vendor_Insurance): Observable<any> {
    return this.httpClient.post<Vendor_Insurance>(`${this.apiUrl}Vendor/AddInsurance`, Insurance, this.httpOptions).pipe(map(result => result))
  }
  AddPayTerms(PayTerms: Vendor_Payment_Terms): Observable<any> {
    return this.httpClient.post<Vendor_Payment_Terms>(`${this.apiUrl}Vendor/AddPayTerms`, PayTerms, this.httpOptions).pipe(map(result => result))
  }
  AddRegistered(Registered: Vendor_Registration): Observable<any> {
    return this.httpClient.post<Vendor_Registration>(`${this.apiUrl}Vendor/AddRegistered`, Registered, this.httpOptions).pipe(map(result => result))
  }
  AddVat(VAT: Vendor_Vat): Observable<any> {
    return this.httpClient.post<Vendor_Vat>(`${this.apiUrl}Vendor/AddVat`, VAT, this.httpOptions).pipe(map(result => result))
  }
  AddIncomeTax(IncomeTax: Vendor_Tax): Observable<any> {
    return this.httpClient.post<Vendor_Tax>(`${this.apiUrl}Vendor/AddIncomeTax`, IncomeTax, this.httpOptions).pipe(map(result => result))
  }
  /////put
  UpdateFax(FaxID: number, Fax: Vendor_Fax): Observable<any> {
    return this.httpClient.put<Vendor_Fax>(`${this.apiUrl}Vendor/UpdateFax/${FaxID}`, Fax, this.httpOptions).pipe(map(result => result))
  }

  UpdateVat(VatID: number, VAT: Vendor_Vat): Observable<any> {
    return this.httpClient.put<Vendor_Vat>(`${this.apiUrl}Vendor/UpdateVat/${VatID}`, VAT, this.httpOptions).pipe(map(result => result))
  }

  UpdateWebsite(WebsiteID: number, Website: Vendor_Website): Observable<any> {
    return this.httpClient.put<Vendor_Website>(`${this.apiUrl}Vendor/UpdateWebsite/${WebsiteID}`, Website, this.httpOptions).pipe(map(result => result))
  }
  UpdateLicense(LicenseID: number, License: Vendor_License): Observable<any> {
    return this.httpClient.put<Vendor_License>(`${this.apiUrl}Vendor/UpdateLicense/${LicenseID}`, License, this.httpOptions).pipe(map(result => result))
  }
  UpdateAgreement(AgreementID: number, Agreement: Vendor_Agreement): Observable<any> {
    return this.httpClient.put<Vendor_Agreement>(`${this.apiUrl}Vendor/UpdateAgreement/${AgreementID}`, Agreement, this.httpOptions).pipe(map(result => result))
  }

  UpdateInsurance(VendorID: number, Insurance: Vendor_Insurance): Observable<any> {
    return this.httpClient.put<Vendor_Insurance>(`${this.apiUrl}Vendor/UpdateInsurance/${VendorID}`, Insurance, this.httpOptions).pipe(map(result => result))
  }

  UpdatePayTerms(PaymentTermsID: number, PayTerms: Vendor_Payment_Terms): Observable<any> {
    return this.httpClient.put<Vendor_Payment_Terms>(`${this.apiUrl}Vendor/UpdatePayTerms/${PaymentTermsID}`, PayTerms, this.httpOptions).pipe(map(result => result))
  }

  UpdateRegistered(RegistrationID: number, Registered: Vendor_Registration): Observable<any> {
    return this.httpClient.put<Vendor_Registration>(`${this.apiUrl}Vendor/UpdateRegistered/${RegistrationID}`, Registered, this.httpOptions).pipe(map(result => result))
  }

  UpdateIncomeTax(IncomeTaxID: number, IncomeTax: Vendor_Tax): Observable<any> {
    return this.httpClient.put<Vendor_Tax>(`${this.apiUrl}Vendor/UpdateIncomeTax/${IncomeTaxID}`, IncomeTax, this.httpOptions).pipe(map(result => result))
  }

  //delete
  DeleteFaxByID(FaxID: number): Observable<any> {
    return this.httpClient.delete<Vendor_Fax>(`${this.apiUrl}Vendor/DeleteFaxByID/${FaxID}`, this.httpOptions).pipe(map(result => result))
  }
  DeleteVatByID(VatID: number): Observable<any> {
    return this.httpClient.delete<Vendor_Vat>(`${this.apiUrl}Vendor/DeleteVatByID/${VatID}`, this.httpOptions).pipe(map(result => result))
  }
  DeleteWebsiteByID(WebsiteID: number): Observable<any> {
    return this.httpClient.delete<Vendor_Website>(`${this.apiUrl}Vendor/DeleteWebsiteByID/${WebsiteID}`, this.httpOptions).pipe(map(result => result))
  }
  DeleteLicenseByID(LicenseID: number): Observable<any> {
    return this.httpClient.delete<Vendor_License>(`${this.apiUrl}Vendor/DeleteLicenseByID/${LicenseID}`, this.httpOptions).pipe(map(result => result))
  }
  DeleteAgreementByID(AgreementID: number): Observable<any> {
    return this.httpClient.delete<Vendor_Agreement>(`${this.apiUrl}Vendor/DeleteAgreementByID/${AgreementID}`, this.httpOptions).pipe(map(result => result))
  }
  DeleteInsuranceByID(VendorID: number, InsuranceTypeID: number): Observable<any> {
    return this.httpClient.delete<Vendor_Insurance>(`${this.apiUrl}Vendor/DeleteInsuranceByID/${VendorID}/${InsuranceTypeID}`, this.httpOptions).pipe(map(result => result))
  }
  DeletePaymentTerms(PaymentTermsID: number): Observable<any> {
    return this.httpClient.delete<Vendor_Payment_Terms>(`${this.apiUrl}Vendor/DeletePaymentTerms/${PaymentTermsID}`, this.httpOptions).pipe(map(result => result))
  }

  DeleteRegistrationByID(RegistrationID: number): Observable<any> {
    return this.httpClient.delete<Vendor_Registration>(`${this.apiUrl}Vendor/DeleteRegistrationByID/${RegistrationID}`, this.httpOptions).pipe(map(result => result))
  }

  DeleteIncomeTaxByID(IncomeTaxID: number): Observable<any> {
    return this.httpClient.delete<Vendor_Tax>(`${this.apiUrl}Vendor/DeleteIncomeTaxByID/${IncomeTaxID}`, this.httpOptions).pipe(map(result => result))
  }

  //--------------------------------------------------------------------------------------Vendor Files--------------------------------------------------------------------------------------

  VendorFileAdd(FolderCategory: string, VendorNo: string, fileName: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', fileName);
    formData.append('FolderCategory', FolderCategory)
    formData.append('VendorNo', VendorNo)
    return this.httpClient.post<any>(`${this.apiUrl}Vendor/uploadVendorFile`, formData, this.httpOptions)
  }

  GetVendorFiles(FolderCategory: string, VendorNo: string, fileName: string): Observable<any> {
    return this.httpClient.post<any>(`${this.apiUrl}Vendor/GetVendorFiles/${FolderCategory}/${VendorNo}/${fileName}`, this.httpOptions)
  }

  DeleteVendorFile(FolderCategory: string, VendorNo: string, fileName: string): Observable<any> {
    return this.httpClient.delete<any>(`${this.apiUrl}Vendor/DeleteVendorFile/${FolderCategory}/${VendorNo}/${fileName}`, this.httpOptions)
  }

  //--------------------------------------------------------------------------------------Vendor Validation--------------------------------------------------------------------------------------
  LicenseNumberVal(LicenseNumber: string): Observable<any> {
    return this.httpClient.get<Vendor_License>(`${this.apiUrl}Vendor/LicenseNumberVal/${LicenseNumber}`, this.httpOptions).pipe(map(result => result))
  }

  CompanyRegNumberVal(CompanyRegNumber: string): Observable<any> {
    return this.httpClient.get<Vendor_Registration>(`${this.apiUrl}Vendor/CompanyRegNumberVal/${CompanyRegNumber}`, this.httpOptions).pipe(map(result => result))
  }
  VatRegNumberVal(vatNumber: string): Observable<any> {
    return this.httpClient.get<Vendor_Vat>(`${this.apiUrl}Vendor/VatRegNumberVal/${vatNumber}`, this.httpOptions).pipe(map(result => result))
  }
  IncomeTaxRegNumberVal(IncomeTaxNumber: string): Observable<any> {
    return this.httpClient.get<Vendor_Tax>(`${this.apiUrl}Vendor/IncomeTaxRegNumberVal/${IncomeTaxNumber}`, this.httpOptions).pipe(map(result => result))
  }

  //--------------------------------------------------------------------------------------Vendor Approved--------------------------------------------------------------------------------------

  AddBEEDetails(VenBEE: Vendor_BEE): Observable<any> {
    return this.httpClient.post<Vendor_BEE>(`${this.apiUrl}Vendor/AddBEEDetails`, VenBEE, this.httpOptions).pipe(map(result => result))
  }

  AddDueDiligence(VenDueDillegence: Due_Dillegence): Observable<any> {
    return this.httpClient.post<Due_Dillegence>(`${this.apiUrl}Vendor/AddDueDiligence`, VenDueDillegence, this.httpOptions).pipe(map(result => result))
  }

  AddPOPI(VenPOPI: POPI): Observable<any> {
    return this.httpClient.post<POPI>(`${this.apiUrl}Vendor/AddPOPI`, VenPOPI, this.httpOptions).pipe(map(result => result))
  }

  GetBEEDetails(VendorID: Number): Observable<any> {
    return this.httpClient.get<Vendor_BEE>(`${this.apiUrl}Vendor/GetBEEDetails/${VendorID}`).pipe(map(result => result))
  }

  GetDueDiligence(VendorID: Number): Observable<any> {
    return this.httpClient.get<Due_Dillegence>(`${this.apiUrl}Vendor/GetDueDiligence/${VendorID}`).pipe(map(result => result))
  }

  GetPOPI(DueDiligenceID: Number): Observable<any> {
    return this.httpClient.get<POPI>(`${this.apiUrl}Vendor/GetPOPI/${DueDiligenceID}`).pipe(map(result => result))
  }

  UpdateBEEDetails(VendorID: number, VenBEE: Vendor_BEE): Observable<any> {
    return this.httpClient.put<Vendor_BEE>(`${this.apiUrl}Vendor/UpdateBEEDetails/${VendorID}`, VenBEE, this.httpOptions).pipe(map(result => result))
  }

  UpdateDueDiligence(VendorID: number, VenDueDillegence: Due_Dillegence): Observable<any> {
    return this.httpClient.put<Due_Dillegence>(`${this.apiUrl}Vendor/UpdateDueDiligence/${VendorID}`, VenDueDillegence, this.httpOptions).pipe(map(result => result))
  }

  UpdatePOPI(DueDiligenceID: number, VenPOPI: POPI): Observable<any> {
    return this.httpClient.put<POPI>(`${this.apiUrl}Vendor/UpdatePOPI/${DueDiligenceID}`, VenPOPI, this.httpOptions).pipe(map(result => result))
  }

  DeleteBEEDetails(VenBeeID: number): Observable<any> {
    return this.httpClient.delete<Vendor_BEE>(`${this.apiUrl}Vendor/DeleteBEEDetails/${VenBeeID}`, this.httpOptions).pipe(map(result => result))
  }

  DeleteDueDiligence(DueDiligenceID: number): Observable<any> {
    return this.httpClient.delete<Due_Dillegence>(`${this.apiUrl}Vendor/DeleteDueDiligence/${DueDiligenceID}`, this.httpOptions).pipe(map(result => result))
  }

  DeletePOPI(POPIID: number): Observable<any> {
    return this.httpClient.delete<POPI>(`${this.apiUrl}Vendor/DeletePOPI/${POPIID}`, this.httpOptions).pipe(map(result => result))
  }

  //--------------------------------------------------------------------------------------Vendor Status Change--------------------------------------------------------------------------------------

  ChangeVendorStatus(statusID: number, VenID: number): Observable<any> {
    return this.httpClient.put(`${this.apiUrl}Vendor/ChangeVendorStatus/${statusID}/${VenID}`, this.httpOptions).pipe(map(result => result))
  }

  ChangeOnboardStatus(statusID: number, onboardRequestId: number, VenID: number): Observable<any> {
    return this.httpClient.put(`${this.apiUrl}Vendor/ChangeOnboardStatus/${statusID}/${onboardRequestId}/${VenID}`, this.httpOptions).pipe(map(result => result))
  }

  //--------------------------------------------------------------------------------------Mandate Limit--------------------------------------------------------------------------------------
  GetMandateLimits(): Observable<any> {
    return this.httpClient.get<Mandate_Limit[]>(`${this.apiUrl}Mandate/GetAllMandateLimits`).pipe(
      map(result => result.map((mandateLimit: Mandate_Limit) => {
        const utcDate = mandateLimit.date as any;
        mandateLimit.date = moment.utc(utcDate).local().format();
        return mandateLimit;

      }))
    );
  }

  GetMandateLimit(mlID: number | Number) {
    return this.httpClient.get<Mandate_Limit>(`${this.apiUrl}Mandate/GetMandateLimit/` + mlID).pipe(
      map(mandateLimit => {
        const utcDate = mandateLimit.date as any;
        mandateLimit.date = moment.utc(utcDate).local().format();
        return mandateLimit;
      })
    );
  }


  AddMandateLimit(ml: Mandate_Limit) {
    return this.httpClient.post(`${this.apiUrl}Mandate/AddMandateLimit`, ml, this.httpOptions)
  }

  EditMandateLimit(mlID: number | Number, ml: Mandate_Limit,) {
    return this.httpClient.put(`${this.apiUrl}Mandate/EditMandateLimit/${mlID}`, ml, this.httpOptions)
  }

  DeleteMandateLimit(mlID: Number) {
    return this.httpClient.delete<string>(`${this.apiUrl}Mandate/DeleteMandateLimit` + "/" + mlID, this.httpOptions)
  }
  //--------------------------------------------------------------------------------------User--------------------------------------------------------------------------------------
  GetUsers(): Observable<any> {
    return this.httpClient.get<User[]>(`${this.apiUrl}User/GetUsers`).pipe(map(result => result))
  }

  GetUser(userID: Number) {
    return this.httpClient.get(`${this.apiUrl}User/GetUser` + "/" + userID).pipe(map(result => result))
  }

  GetUserByUsername(username: string) {
    return this.httpClient.get<User>(`${this.apiUrl}User/GetUserByUsername` + "/" + username).pipe(map(result => result))
  }

  AddUser(user: User) {
    return this.httpClient.post(`${this.apiUrl}User/CreateUser`, user, this.httpOptions)
  }

  EditUser(usr: User, userID: number) {
    return this.httpClient.put<User>(`${this.apiUrl}User/EditUser/` + userID, usr, this.httpOptions)
  }

  DeleteUser(userID: number) {
    return this.httpClient.delete<string>(`${this.apiUrl}User/DeleteUser` + "/" + userID, this.httpOptions)
  }

  EditUserValidation(name: string, id: Number): Observable<User> {
    return this.httpClient.get<User>(`${this.apiUrl}User/EditUserValidation/` + name + '/' + id, this.httpOptions)
  }

  CreateUserValidation(name: String): Observable<User> {
    return this.httpClient.get<User>(`${this.apiUrl}User/CreateUserValidation/` + name, this.httpOptions)
  }

  SendEmail(mail: MailData) {
    return this.httpClient.post(`${this.apiUrl}Mail/sendemailusingtemplate`, mail, this.httpOptions)
  }
  SendPasswordEmail(mail: MailData) {
    return this.httpClient.post(`${this.apiUrl}Mail/ForgotPasswordEmail`, mail, this.httpOptions)
  }

  UpdatePassword(UserID: Number, NewPassword: String) {
    return this.httpClient.put<User>(`${this.apiUrl}User/UpdatePassword/` + UserID + "/" + NewPassword, this.httpOptions)
  }

  VerifyCredentials(UserName: String, Password: String) {
    return this.httpClient.get(`${this.apiUrl}User/VerifyCredentials/` + UserName + "/" + Password, this.httpOptions)
  }



  //ProfilePhotoAdd(file: File): Observable<any> {
  //  const formData = new FormData();
  //  formData.append('file', file);
  //  return this.httpClient.post<any>(`${this.apiUrl}User/uploadPhoto`, formData, this.httpOptions)
  //}

  //getPhoto(imgURL: string): Observable<Blob> {
  //  return this.httpClient.get(imgURL, { responseType: 'blob' })
  //}

  //--------------------------------------------------------------------------------------Employee--------------------------------------------------------------------------------------
  GetEmployees(): Observable<any> {
    return this.httpClient.get<Employee[]>(`${this.apiUrl}User/GetEmployees`).pipe(map(result => result))
  }

  GetEmployee(userID: number) {
    return this.httpClient.get(`${this.apiUrl}User/GetEmployee` + "/" + userID).pipe(map(result => result))
  }
  getEmployeebyEmail(Email: String) {
    return this.httpClient.get<Employee>(`${this.apiUrl}User/GetEmployeeByEmail/` + Email).pipe(map(result => result))
  }

  getAdminbyEmail(Email: String) {
    return this.httpClient.get<Admin>(`${this.apiUrl}User/GetAdminByEmail/` + Email).pipe(map(result => result))
  }

  GetEmployeeID(userID: Number) {
    return this.httpClient.get(`${this.apiUrl}User/GetEmployee` + "/" + userID).pipe(map(result => result))
  }

  GetEmployeeByUsername(username: string) {
    return this.httpClient.get(`${this.apiUrl}User/GetEmployeeByUsername` + "/" + username).pipe(map(result => result))
  }

  AddEmployee(emp: Employee) {
    return this.httpClient.post(`${this.apiUrl}User/CreateEmployee`, emp, this.httpOptions)
  }

  EditEmployee(emp: Employee, userID: number) {
    return this.httpClient.put<Employee>(`${this.apiUrl}User/EditEmployee/` + userID, emp, this.httpOptions)
  }

  DeleteEmployee(userID: number) {
    return this.httpClient.delete<string>(`${this.apiUrl}User/DeleteEmployee` + "/" + userID, this.httpOptions)
  }

  //--------------------------------------------------------------------------------------Admin--------------------------------------------------------------------------------------
  GetAdmins(): Observable<any> {
    return this.httpClient.get<Admin[]>(`${this.apiUrl}User/GetAdmins`).pipe(map(result => result))
  }

  GetAdmin(userID: number) {
    return this.httpClient.get(`${this.apiUrl}User/GetAdmin` + "/" + userID).pipe(map(result => result))
  }

  GetAdminByUsername(username: string) {
    return this.httpClient.get(`${this.apiUrl}User/GetAdminByUsername` + "/" + username).pipe(map(result => result))
  }

  AddAdmin(adm: Admin) {
    return this.httpClient.post(`${this.apiUrl}User/CreateAdmin`, adm, this.httpOptions)
  }

  EditAdmin(adm: Admin, userID: number) {
    return this.httpClient.put<Admin>(`${this.apiUrl}User/EditAdmin/` + userID, adm, this.httpOptions)
  }

  DeleteAdmin(userID: number) {
    return this.httpClient.delete<string>(`${this.apiUrl}User/DeleteAdmin` + "/" + userID, this.httpOptions)
  }

  //--------------------------------------------------------------------------------------Role--------------------------------------------------------------------------------------
  GetRoles(): Observable<any> {
    return this.httpClient.get<Role[]>(`${this.apiUrl}Role/GetRoles`).pipe(map(result => result))
  }

  GetRole(roleID: number) {
    return this.httpClient.get(`${this.apiUrl}Role/GetRole` + "/" + roleID).pipe(map(result => result))
  }

  AddRole(role: Role) {
    return this.httpClient.post(`${this.apiUrl}Role/CreateRole`, role, this.httpOptions)
  }

  EditRole(roleID: number, role: Role) {
    return this.httpClient.put<Role>(`${this.apiUrl}Role/EditRole/` + roleID, role, this.httpOptions)
  }

  DeleteRole(roleID: number) {
    return this.httpClient.delete<string>(`${this.apiUrl}Role/DeleteRole` + "/" + roleID, this.httpOptions)
  }

  CreateRoleValidation(name: String): Observable<Role> {
    return this.httpClient.get<Role>(`${this.apiUrl}Role/CreateRoleValidation/` + name, this.httpOptions)
  }

  EditRoleValidation(name: String, id: Number): Observable<Role> {
    return this.httpClient.get<Role>(`${this.apiUrl}Role/EditRoleValidation/` + name + '/' + id, this.httpOptions)
  }

  //--------------------------------------------------------------------------------------Login--------------------------------------------------------------------------------------
  login(username: string, password: string) {
    return this.httpClient.post(`${this.apiUrl}User/login/` + username + "/" + password, this.httpOptions)
  }

  loginWithTemp(username: string, password: string, tempacc) {
    return this.httpClient.post(`${this.apiUrl}User/loginWithTemp/` + username + "/" + password + "/" + tempacc, this.httpOptions)
  }

  //--------------------------------------------------------------------------------------Budget Allocations--------------------------------------------------------------------------------------
  GetBudgetCategories(): Observable<any> {
    return this.httpClient.get<BudgetCategory[]>(`${this.apiUrl}BudgetAllocation/GetAllBudgetCategories`).pipe(map(result => result))
  }

  GetBudgetCategory(budgetCategoryID: number | Number) {
    return this.httpClient.get(`${this.apiUrl}BudgetAllocation/GetBudgetCategory` + '/' + budgetCategoryID).pipe(map(result => result))
  }

  AddBudgetCategory(budgetCategory: BudgetCategory) {
    return this.httpClient.post<BudgetCategory>(`${this.apiUrl}BudgetAllocation/AddBudgetCategory`, budgetCategory, this.httpOptions)
  }

  EditBudgetCategory(budgetCategoryID: Number, budgetCategory: BudgetCategory) {
    return this.httpClient.put<BudgetCategory>(`${this.apiUrl}BudgetAllocation/EditBudgetCategory/${budgetCategoryID}`, budgetCategory, this.httpOptions)
  }

  DeleteBudgetCategory(budgetCategoryID: Number) {
    return this.httpClient.delete<string>(`${this.apiUrl}BudgetAllocation/DeleteBudgetCategory` + "/" + budgetCategoryID, this.httpOptions)
  }

  BudgetCategoryValidation(name: String): Observable<BudgetCategory> {
    return this.httpClient.get<BudgetCategory>(`${this.apiUrl}BudgetAllocation/BudgetCategoryValidation/` + name, this.httpOptions)
  }

  GetBudgetAllocations(): Observable<any> {
    return this.httpClient.get<BudgetAllocation[]>(`${this.apiUrl}BudgetAllocation/GetAllBudgetAllocations`)
      .pipe(
        map(budgetAllocations => budgetAllocations.map(budgetAllocation => {
          const date = budgetAllocation.date_Created as any;
          budgetAllocation.date_Created = moment.utc(date).local().format();
          return budgetAllocation;
        }))
      );
  }

  GetBudgetAllocation(budgetAllocationID: number | Number) {
    return this.httpClient.get<BudgetAllocation>(`${this.apiUrl}BudgetAllocation/GetBudgetAllocation` + '/' + budgetAllocationID)
      .pipe(
        map(budgetAllocation => {
          const date = budgetAllocation.date_Created as any;
          budgetAllocation.date_Created = moment.utc(date).local().format();
          return budgetAllocation;
        })
      );
  }

  AddBudgetAllocation(budgetAllocation: BudgetAllocation) {
    return this.httpClient.post<BudgetAllocation>(`${this.apiUrl}BudgetAllocation/AddBudgetAllocation`, budgetAllocation, this.httpOptions)
  }

  EditBudgetAllocation(budgetAllocationID: Number, budgetAllocation: BudgetAllocation) {
    return this.httpClient.put<BudgetAllocation>(`${this.apiUrl}BudgetAllocation/EditBudgetAllocation/${budgetAllocationID}`, budgetAllocation, this.httpOptions)
  }

  DeleteBudgetAllocation(budgetAllocationID: Number) {
    return this.httpClient.delete<string>(`${this.apiUrl}BudgetAllocation/DeleteBudgetAllocation` + "/" + budgetAllocationID, this.httpOptions)
  }

  BudgetAllocationValidation(departmentName: String, year: Number): Observable<BudgetAllocation> {
    return this.httpClient.get<BudgetAllocation>(`${this.apiUrl}BudgetAllocation/BudgetAllocationValidation/` + departmentName + "/" + year, this.httpOptions)
  }

  GetBudgetLineItems(budgetAllocationID: Number): Observable<any> {
    return this.httpClient.get<BudgetLine[]>(`${this.apiUrl}BudgetAllocation/GetBudgetLinesForAllocation/${budgetAllocationID}`).pipe(map(result => result))
  }

  GetBudgetLines(): Observable<any> {
    return this.httpClient.get<BudgetLine[]>(`${this.apiUrl}BudgetAllocation/GetAllBudgetLines`).pipe(map(result => result))
  }

  AddBudgetLine(budgetLine: BudgetLine) {
    return this.httpClient.post<BudgetLine>(`${this.apiUrl}BudgetAllocation/AddBudgetLine`, budgetLine, this.httpOptions)
  }

  GetBudgetLine(accountCode: Number) {
    return this.httpClient.get(`${this.apiUrl}BudgetAllocation/GetBudgetLine` + '/' + accountCode).pipe(map(result => result))
  }

  EditBudgetLine(accountCode: Number, budgetLine: BudgetLine) {
    return this.httpClient.put<BudgetLine>(`${this.apiUrl}BudgetAllocation/EditBudgetLine/${accountCode}`, budgetLine, this.httpOptions)
  }

  DeleteBudgetLine(accountCode: Number) {
    return this.httpClient.delete<string>(`${this.apiUrl}BudgetAllocation/DeleteBudgetLine` + "/" + accountCode, this.httpOptions)
  }

  decodeUserRole(token: string): any {
    try {
      const tokenParts = token.split('.');
      const tokenPayload = tokenParts[1];
      const decodedPayload = JSON.parse(atob(tokenPayload));
      console.log(decodedPayload)

      return decodedPayload.role;

    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  decodeUser(token: string): any {
    try {
      const tokenParts = token.split('.');
      const tokenPayload = tokenParts[1];
      const decodedPayload = JSON.parse(atob(tokenPayload));

      return decodedPayload.unique_name;

    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  UpdateStock(HistoryAdd: Consumable_History) {
    return this.httpClient.post<Consumable_History>(`${this.apiUrl}Consumable/UpdateStock`, HistoryAdd).pipe(map(result => result))
  }

  GetConsumablePredictions(id: Number): Observable<{ Year: Number, Month: Number, ActualAmount: Number, PredictedAmount: Number }[]> {
    return this.httpClient.get<any[]>(`${this.apiUrl}Consumable/PredictConsumable/` + id).pipe(
      map(result => {
        console.log(result); // Log the returned result
        return result.map(item => ({ Year: item.item1, Month: item.item2, ActualAmount: item.item3, PredictedAmount: item.item4 }));
      })
    );
  }
  //--------------------------------------------------------------------------------------Delegation--------------------------------------------------------------------------------------
  GetDelegations(): Observable<any> {
    return this.httpClient.get<Delegation_Of_Authority[]>(`${this.apiUrl}Delegation/GetDelegations`).pipe(map(result => result))
  }

  GetDelegationsByRole(): Observable<any> {
    return this.httpClient.get<Delegation_Of_Authority[]>(`${this.apiUrl}Delegation/GetDelegationsByRole`).pipe(map(result => result))
  }

  GetActiveDelegations(): Observable<any> {
    return this.httpClient.get<Delegation_Of_Authority[]>(`${this.apiUrl}Delegation/GetActiveDelegations`).pipe(map(result => result))
  }

  DelegateFileAdd(DelegateName: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('DelegateName', DelegateName)
    return this.httpClient.post<any>(`${this.apiUrl}Delegation/uploadDelegationFile`, formData, this.httpOptions)
  }

  AddDelegation(doa: Delegation_Of_Authority) {
    return this.httpClient.post(`${this.apiUrl}Delegation/CreateDelegation`, doa, this.httpOptions)
  }

  GetDelegateionFiles(DelegateName: string, filename: string): Observable<any> {
    return this.httpClient.post<any>(`${this.apiUrl}Delegation/GetDelegateionFiles/${DelegateName}/${filename}`, this.httpOptions)
  }

  GetDelegation(delegationID: Number) {
    return this.httpClient.get(`${this.apiUrl}Delegation/GetDelegation` + "/" + delegationID).pipe(map(result => result))
  }

  DeleteDelegationFile(DelegateName: string, fileName: string): Observable<any> {
    return this.httpClient.delete<any>(`${this.apiUrl}Delegation/DeleteFile/${DelegateName}/${fileName}`, this.httpOptions)
  }

  DeleteDelegation(delegationID: number): Observable<any> {
    return this.httpClient.delete<Delegation_Of_Authority>(`${this.apiUrl}Delegation/DeleteDelegation/${delegationID}`, this.httpOptions)
  }

  DeleteTempAcc(delegationID: number): Observable<any> {
    return this.httpClient.delete<Temporary_Access>(`${this.apiUrl}Delegation/DeleteTempAcc/${delegationID}`, this.httpOptions)
  }

  EditDelegation(DelegationUpdate: Delegation_Of_Authority, delegationID: number) {
    return this.httpClient.put<Delegation_Of_Authority>(`${this.apiUrl}Delegation/EditDelegation/` + delegationID, DelegationUpdate, this.httpOptions)
  }

  EditDelegationStatus(statusID: number, delegationID: number) {
    return this.httpClient.put<Delegation_Of_Authority>(`${this.apiUrl}Delegation/EditDelegationStatus/` + statusID + `/` + delegationID, this.httpOptions)
  }

  GetStatuses(): Observable<any> {
    return this.httpClient.get<DelegationStatus[]>(`${this.apiUrl}Delegation/GetRejStatuses`).pipe(map(result => result))
  }

  AddTempAcc(ta: Temporary_Access) {
    return this.httpClient.post(`${this.apiUrl}Delegation/AddTempAcc`, ta, this.httpOptions)
  }

  GetTempAcc(delegationID: Number) {
    return this.httpClient.get(`${this.apiUrl}Delegation/GetTempAcc` + "/" + delegationID).pipe(map(result => result))
  }

  InitiatRecurringJobDelegation() {
    return this.httpClient.get(`${this.apiUrl}Home/RecurringJobDelegation`, this.httpOptions)
  }

  CheckDelegation() {
    return this.httpClient.put(`${this.apiUrl}Home/CheckDelegation`, this.httpOptions)
  }

  //--------------------------------------------------------------------------------------Notifications--------------------------------------------------------------------------------------
  GetNotifications(username: string): Observable<any> {
    return this.httpClient.get<Notification[]>(`${this.apiUrl}Notification/GetNotifications` + "/" + username).pipe(map(result => result))
  }

  GetVendorNotifications(username: string): Observable<any> {
    return this.httpClient.get<Notification[]>(`${this.apiUrl}Notification/GetVendorNotifications` + "/" + username).pipe(map(result => result))
  }

  GetInventoryNotifications(username: string): Observable<any> {
    return this.httpClient.get<Notification[]>(`${this.apiUrl}Notification/GetInventoryNotifications` + "/" + username).pipe(map(result => result))
  }

  GetProcurementNotifications(username: string): Observable<any> {
    return this.httpClient.get<Notification[]>(`${this.apiUrl}Notification/GetProcurementNotifications` + "/" + username).pipe(map(result => result))
  }

  ResetNotif(username: string) {
    return this.httpClient.put<User>(`${this.apiUrl}User/ResetNotif/` + username, this.httpOptions)
  }
 

  //----------------------------------------------------------------------Procurement Request-----------------------------------------------------------------------------
  GetProcurementRequests(): Observable<any> {
    return this.httpClient.get<Procurement_Request[]>(`${this.apiUrl}ProcurementRequest/GetProcurementRequests`).pipe(map(result => result))
  }

  AddProcurementRequest(AddProcurementRequest: Procurement_Request) {
    return this.httpClient.post<Procurement_Request>(`${this.apiUrl}ProcurementRequest/CreateProcurementRequest`, AddProcurementRequest).pipe(map(result => result))
  }

  ProcurementRequestFileAdd(VendorName: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('VendorName', VendorName)
    return this.httpClient.post<any>(`${this.apiUrl}ProcurementRequest/uploadProcurementQuote`, formData, this.httpOptions)
  }

  AddProcurementRequestQuote(AddProcurementRequestQuote: Procurement_Request_Quote) {
    return this.httpClient.post<Procurement_Request_Quote>(`${this.apiUrl}ProcurementRequest/CreateProcurementQuote`, AddProcurementRequestQuote).pipe(map(result => result))
  }


  //----------------------------------------------------------------------PlaceProcurement-----------------------------------------------------------------------------

  AddProcurementDetails(ProcurementDetails: Procurement_Details): Observable<any> {
    return this.httpClient.post<Procurement_Details>(`${this.apiUrl}ProcurementDetails/AddProcurementDetails`, ProcurementDetails, this.httpOptions).pipe(map(result => result))
  }

  GetProcurementRequestByID(ProcurementRequestID: number): Observable<any> {
    return this.httpClient.get<Procurement_Request>(`${this.apiUrl}ProcurementDetails/GetProcurementRequestByID/${ProcurementRequestID}`).pipe(map(result => result))
  }

  AddDeposit(DepositDetails: Deposit): Observable<any> {
    return this.httpClient.post<Deposit>(`${this.apiUrl}ProcurementDetails/AddDeposit`, DepositDetails, this.httpOptions).pipe(map(result => result))
  }
  AddPaymentMade(AddPaymentMade: Payment_Made): Observable<any> {
    return this.httpClient.post<Payment_Made>(`${this.apiUrl}ProcurementDetails/AddPaymentMade`, AddPaymentMade, this.httpOptions).pipe(map(result => result))
  }

  AddProofOfPayment(AddPOP: Proof_Of_Payment): Observable<any> {
    return this.httpClient.post<Proof_Of_Payment>(`${this.apiUrl}ProcurementDetails/AddProofOfPayment`, AddPOP, this.httpOptions).pipe(map(result => result))
  }

  AddProcurementConsumable(AddProcurementConsumable: Procurement_Consumable): Observable<any> {
    return this.httpClient.post<Procurement_Consumable>(`${this.apiUrl}ProcurementDetails/AddProcurementConsumable`, AddProcurementConsumable, this.httpOptions).pipe(map(result => result))
  }

  AddVendorConsumable(AddVendorConsumable: Vendor_Consumable): Observable<any> {
    return this.httpClient.post<Vendor_Consumable>(`${this.apiUrl}ProcurementDetails/AddVendorConsumable`, AddVendorConsumable, this.httpOptions).pipe(map(result => result))
  }

  AddAsset(AddAsset: Asset): Observable<any> {
    return this.httpClient.post<Asset>(`${this.apiUrl}ProcurementDetails/AddAsset`, AddAsset, this.httpOptions).pipe(map(result => result))
  }

  AddProcurementAsset(AddProcurementAsset: Procurement_Asset): Observable<any> {
    return this.httpClient.post<Procurement_Asset>(`${this.apiUrl}ProcurementDetails/AddProcurementAsset`, AddProcurementAsset, this.httpOptions).pipe(map(result => result))
  }

  AddVendorAsset(AddVendorAsset: Vendor_Asset): Observable<any> {
    return this.httpClient.post<Vendor_Asset>(`${this.apiUrl}ProcurementDetails/AddVendorAsset`, AddVendorAsset, this.httpOptions).pipe(map(result => result))
  }

  uploadProcureFile(FolderCategory: string, ProcurementID: string, fileName: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', fileName);
    formData.append('FolderCategory', FolderCategory)
    formData.append('ProcurementRequest', ProcurementID)
    return this.httpClient.post<any>(`${this.apiUrl}ProcurementDetails/uploadProcureFile`, formData, this.httpOptions)
  }

  GetProcureFiles(FolderCategory: string, ProcurementID: string, fileName: string): Observable<any> {
    return this.httpClient.post<any>(`${this.apiUrl}ProcurementDetails/GetProcureFiles/${FolderCategory}/${ProcurementID}/${fileName}`, this.httpOptions)
  }

  DeleteProcurementFile(FolderCategory: string, ProcurementID: string, fileName: string): Observable<any> {
    return this.httpClient.delete<any>(`${this.apiUrl}ProcurementDetails/DeleteProcurementFile/${FolderCategory}/${ProcurementID}/${fileName}`, this.httpOptions)
  }
  GetProcurementQuotes(): Observable<any> {
    return this.httpClient.get<Procurement_Request_Quote[]>(`${this.apiUrl}ProcurementRequest/GetProcurementQuotes`).pipe(map(result => result))
  }

  GetPRRequestByID(RequestID: Number): Observable<Procurement_Request> {
    return this.httpClient.get<Procurement_Request>(`${this.apiUrl}ProcurementRequest/GetRequestByID/` + RequestID, this.httpOptions)
  }

  DeletePRRequest(RequestID: Number): Observable<Procurement_Request> {
    return this.httpClient.delete<Procurement_Request>(`${this.apiUrl}ProcurementRequest/DeleteRequest/` + RequestID, this.httpOptions)
  }


  DeleteProcurementRequestFiles(VendorName: string, fileName: string): Observable<any> {
    return this.httpClient.delete<any>(`${this.apiUrl}ProcurementRequest/DeleteFile/${VendorName}/${fileName}`, this.httpOptions)
  }

  GetProcurementQuotesbyID(id: Number): Observable<any> {
    return this.httpClient.get<Procurement_Request_Quote[]>(`${this.apiUrl}ProcurementRequest/GetProcurementQuotesbyID/` + id).pipe(map(result => result))
  }

}
