import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Cons, map, Observable, Subject } from 'rxjs';
import { Consumable } from '../Shared/Consumable';
import { Role } from '../Shared/EmployeeRole';
import { Employee } from '../Shared/Employee';
import { ConsumableCategory } from '../Shared/ConsumableCategory';

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
  //Consumables
  GetConsumables(): Observable<any> {
    return this.httpClient.get<Consumable[]>(`${this.apiUrl}Consumable/GetConsumables`).pipe(map(result => result))
  }
  AddConsumables(AddConsumableRequest: Consumable) {
    return this.httpClient.post<Consumable>(`${this.apiUrl}Consumable/CreateConsumable`, AddConsumableRequest).pipe(map(result => result))
  }

  GetRoles(): Observable<any> {
    return this.httpClient.get<Role[]>(`${this.apiUrl}Role/GetRoles`).pipe(map(result => result))
  }

  AddRole(role: Role) {
    return this.httpClient.post(`${this.apiUrl}Role/CreateRole`, role, this.httpOptions)
  }

  GetRole(roleID: number) {
    return this.httpClient.get(`${this.apiUrl}Role/GetRole` + "/" + roleID).pipe(map(result => result))
  }

  EditRole(roleID: number, role: Role) {
    return this.httpClient.put<Role>(`${this.apiUrl}Role/EditRole/` + roleID, role, this.httpOptions)
  }

  DeleteRole(roleID: number) {
    return this.httpClient.delete<string>(`${this.apiUrl}Role/DeleteRole` + "/" + roleID, this.httpOptions)
  }

  GetEmployees(): Observable<any> {
    return this.httpClient.get<Employee[]>(`${this.apiUrl}User/GetEmployees`).pipe(map(result => result))
  }

  GetCategories() {
    return this.httpClient.get<ConsumableCategory[]>(`${this.apiUrl}ConsumableCategory/GetConsumableCategories`).pipe(map(result => result))
  }

  DeleteConsumable(ConsumableID: Number): Observable<Consumable> {
    return this.httpClient.delete<Consumable>(`${this.apiUrl}Consumable/DeleteConsumable/` + ConsumableID, this.httpOptions)
  }

  GetConsumableByID(consumableID: Number): Observable<Consumable> {
    console.log(consumableID)
    return this.httpClient.get<Consumable>(`${this.apiUrl}Consumable/GetConsumableByID/` + consumableID, this.httpOptions)
  }

  UpdateConsumable(consumableID: Number, UpdateConsumableRequest: Consumable): Observable<Consumable> {
    return this.httpClient.put<Consumable>(`${this.apiUrl}Consumable/UpdateConsumable/` + consumableID, UpdateConsumableRequest, this.httpOptions)
  }

  ConsumableValidation(name: String, category: String): Observable<Consumable> {
    return this.httpClient.get<Consumable>(`${this.apiUrl}Consumable/ConsumableValidation/` + name + "/" + category, this.httpOptions)
  }
  GetBranches(): Observable<any> {
    return this.httpClient.get<Branch[]>(`${this.apiUrl}Branch/GetAllBranches`).pipe(map(result => result))
  }

  GetDepartments(): Observable<any> {
    return this.httpClient.get<Department[]>(`${this.apiUrl}Department/GetAllDepartments`).pipe(map(result => result))
  }

  AddUser(user: User) {
    return this.httpClient.post(`${this.apiUrl}User/CreateUser`, user, this.httpOptions)
  }

  AddEmployee(emp: Employee) {
    return this.httpClient.post(`${this.apiUrl}User/CreateEmployee`, emp, this.httpOptions)
  }

  GetEmployee(userID: number) {
    return this.httpClient.get(`${this.apiUrl}User/GetEmployee` + "/" + userID).pipe(map(result => result))
  }

  GetEmployeeID(userID: Number) {
    return this.httpClient.get(`${this.apiUrl}User/GetEmployee` + "/" + userID).pipe(map(result => result))
  }

  GetBranch(Branch_ID: number) {
    return this.httpClient.get(`${this.apiUrl}Branch/GetBranch` + Branch_ID).pipe(map(result => result))
  }

  EditUser(usr: User, userID: number) {
    return this.httpClient.put<User>(`${this.apiUrl}User/EditUser/` + userID, usr, this.httpOptions)
  }

  EditEmployee(emp: Employee, userID: number) {
    return this.httpClient.put<Employee>(`${this.apiUrl}User/EditEmployee/` + userID, emp, this.httpOptions)
  }

  DeleteEmployee(userID: number) {
    return this.httpClient.delete<string>(`${this.apiUrl}User/DeleteEmployee` + "/" + userID, this.httpOptions)
  }

  DeleteUser(userID: number) {
    return this.httpClient.delete<string>(`${this.apiUrl}User/DeleteUser` + "/" + userID, this.httpOptions)
  }




  //Admin
  GetAdmins(): Observable<any> {
    return this.httpClient.get<Admin[]>(`${this.apiUrl}User/GetAdmins`).pipe(map(result => result))
  }

  GetAdmin(userID: number) {
    return this.httpClient.get(`${this.apiUrl}User/GetAdmin` + "/" + userID).pipe(map(result => result))
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

  CreateCategory(AddCategoryRequest: ConsumableCategory) {
    return this.httpClient.post<ConsumableCategory>(`${this.apiUrl}ConsumableCategory/CreateCategory`, AddCategoryRequest).pipe(map(result => result))
  }

  GetCategoryByID(categoryID: Number): Observable<ConsumableCategory> {
    return this.httpClient.get<ConsumableCategory>(`${this.apiUrl}ConsumableCategory/GetConsumableCategoryByID/` + categoryID, this.httpOptions)

  }

  UpdateCategory(CategoryID: Number, UpdateCategoryRequest: ConsumableCategory): Observable<ConsumableCategory> {
    return this.httpClient.put<ConsumableCategory>(`${this.apiUrl}ConsumableCategory/UpdateConsumableCategory/` + CategoryID, UpdateCategoryRequest, this.httpOptions)
  }

  DeleteCategory(CategoryID: Number): Observable<ConsumableCategory> {
    return this.httpClient.delete<ConsumableCategory>(`${this.apiUrl}ConsumableCategory/DeleteCategory/` + CategoryID, this.httpOptions)
  }
  CategoryValidation(name: String, description: String): Observable<ConsumableCategory> {
    return this.httpClient.get<ConsumableCategory>(`${this.apiUrl}ConsumableCategory/CategoryValidation/` + name + "/" + description, this.httpOptions)
  }
  UserValidation(name: String): Observable<User> {
    return this.httpClient.get<User>(`${this.apiUrl}User/UserValidation/` + name, this.httpOptions)
  }

  RoleValidation(name: String): Observable<Role> {
    return this.httpClient.get<Role>(`${this.apiUrl}Role/RoleValidation/` + name, this.httpOptions)
  }

  GetUsers(): Observable<any> {
    return this.httpClient.get<User[]>(`${this.apiUrl}User/GetUsers`).pipe(map(result => result))
  }

  GetUser(userID: Number) {
    return this.httpClient.get(`${this.apiUrl}User/GetUser` + "/" + userID).pipe(map(result => result))
  }
  GetMandateLimits(): Observable<any> {
    return this.httpClient.get<Mandate_Limit[]>(`${this.apiUrl}Mandate/GetAllMandateLimits`).pipe(map(result => result))
  }

  GetMandateLimit(mlID: number) {
    return this.httpClient.get(`${this.apiUrl}Mandate/GetMandateLimit` + "/" + mlID).pipe(map(result => result))
  }

  AddMandateLimit(ml: Mandate_Limit) {
    return this.httpClient.post(`${this.apiUrl}Mandate/AddMandateLimit`, ml, this.httpOptions)
  }

  EditMandateLimit(mlID: number | Number, ml: Mandate_Limit,) {
    return this.httpClient.put(`${this.apiUrl}Mandate/EditMandateLimit/${mlID}`, ml, this.httpOptions)
  }

  //requests

  GetAllOnboardRequest(): Observable<any> {
    return this.httpClient.get<VendorOnboardRequestVM[]>(`${this.apiUrl}OnboardRequest/GetAllOnboardRequest`).pipe(map(result => result))
  }

  AddOnboardRequest(AddRequest: OnboardRequest) {
    return this.httpClient.post(`${this.apiUrl}OnboardRequest/CreateOnboardRequest`, AddRequest, this.httpOptions)
  }

  GetVendorsRequest() {
    return this.httpClient.get<VendorOnboardRequest[]>(`${this.apiUrl}OnboardRequest/GetAllVendor`).pipe(map(result => result))
  }

  GetRequestByID(RequestID:number): Observable<any> {
    return this.httpClient.get<OnboardRequest[]>(`${this.apiUrl}OnboardRequest/GetRequest/${RequestID}`, this.httpOptions).pipe(map(result => result))
  }

  UpdateOnboardRequest(RequestID: number,VendorID:number, UpdatedRequest: OnboardRequest,): Observable<OnboardRequest> {
    return this.httpClient.put<OnboardRequest>(`${this.apiUrl}OnboardRequest/UpdateOnboardRequest/${RequestID}/${VendorID}`, UpdatedRequest, this.httpOptions)
  }

  DeleteRequest(RequestId:number,VendorID:number): Observable<any> {
    return this.httpClient.delete<OnboardRequest>(`${this.apiUrl}OnboardRequest/DeleteRequest/${RequestId}/${VendorID}`, this.httpOptions)
  }
  //end of request 

  //files

  DeleteFile(RequestNo:string,fileName:string): Observable<any> {
    return this.httpClient.delete<any>(`${this.apiUrl}OnboardRequest/DeleteFile/${RequestNo}/${fileName}`, this.httpOptions)
  }

  
  //end of files

  //vendor details
  GetAllVendorDetails(): Observable<any> {
    return this.httpClient.get<VendorDetails[]>(`${this.apiUrl}Vendor/GetAllVendorDetails`).pipe(map(result => result))
  }

  GetVendorDetailByID(VendorDetailID:number): Observable<any> {
    return this.httpClient.get<VendorDetails>(`${this.apiUrl}Vendor/GetVendorDetailByID/${VendorDetailID}`, this.httpOptions).pipe(map(result => result))
  }

  getAllApprovedVendors(): Observable<any> {
    return this.httpClient.get<VendorOnboardRequest[]>(`${this.apiUrl}Vendor/getAllApprovedVendors`).pipe(map(result => result))
  }

  GetVendorByID(VendorID: number): Observable<any> {
    return this.httpClient.get<VendorOnboardRequest>(`${this.apiUrl}Vendor/GetVendorByID/${VendorID}`).pipe(map(result => result))
  }

  AddVendorDetails(VenDetails:VendorDetails):Observable<any>{
  return this.httpClient.post<VendorDetails>(`${this.apiUrl}Vendor/AddVendorDetails`,VenDetails, this.httpOptions).pipe(map(result => result))
 }  

 UpdateVendorDetails(VendorDetailsID:number,VenDetails:VendorDetails ):Observable<VendorDetails>{
  return this.httpClient.put<VendorDetails>(`${this.apiUrl}Vendor/UpdateVendorDetails/${VendorDetailsID}`,VenDetails, this.httpOptions).pipe(map(result => result))
 }  
 
  DeleteVendorDetails(vendorDetailsID:number): Observable<any> {
    return this.httpClient.delete<VendorDetails>(`${this.apiUrl}Vendor/DeleteVendorDetails/${vendorDetailsID}`, this.httpOptions).pipe(map(result => result))
  }

 //GetDifferentTables
  GetFaxByID(FaxID:number): Observable<any> {
    return this.httpClient.get<VendorDetails>(`${this.apiUrl}Vendor/GetFaxByID/${FaxID}`, this.httpOptions).pipe(map(result => result))
  }
  GetVatByID(VatID:number): Observable<any> {
    return this.httpClient.get<Vendor_Vat>(`${this.apiUrl}Vendor/GetVatByID/${VatID}`, this.httpOptions).pipe(map(result => result))
  }
  GetWebsiteByID(WebsiteID:number): Observable<any> {
    return this.httpClient.get<Vendor_Website>(`${this.apiUrl}Vendor/GetWebsiteByID/${WebsiteID}`, this.httpOptions).pipe(map(result => result))
  }
  GetLicenseByID(LicenseID:number): Observable<any> {
    return this.httpClient.get<Vendor_License>(`${this.apiUrl}Vendor/GetLicenseByID/${LicenseID}`, this.httpOptions).pipe(map(result => result))
  }
  GetAgreementByID(AgreementID:number): Observable<any> {
    return this.httpClient.get<Vendor_Agreement>(`${this.apiUrl}Vendor/GetAgreementByID/${AgreementID}`, this.httpOptions).pipe(map(result => result))
  }
  GetInsuranceByID(InsuranceID:number): Observable<any> {
    return this.httpClient.get<Vendor_Insurance>(`${this.apiUrl}Vendor/GetInsuranceByID/${InsuranceID}`, this.httpOptions).pipe(map(result => result))
  }
  GetPaymentTerms(PaymentTermsID:number): Observable<any> {
    return this.httpClient.get<Vendor_Payment_Terms>(`${this.apiUrl}Vendor/GetPaymentTerms/${PaymentTermsID}`, this.httpOptions).pipe(map(result => result))
  }

  GetRegistrationByID(RegistrationID:number): Observable<any> {
    return this.httpClient.get<Vendor_Registration>(`${this.apiUrl}Vendor/GetRegistrationByID/${RegistrationID}`, this.httpOptions).pipe(map(result => result))
  }
  GetIncomeTaxByID(IncomeTaxID:number): Observable<any> {
    return this.httpClient.get<Vendor_Tax>(`${this.apiUrl}Vendor/GetIncomeTaxByID/${IncomeTaxID}`, this.httpOptions).pipe(map(result => result))
  }
  //post
  AddFax(Fax:Vendor_Fax):Observable<any>{
    return this.httpClient.post<Vendor_Fax>(`${this.apiUrl}Vendor/AddFax`,Fax, this.httpOptions).pipe(map(result => result))
   } 
   AddWebsite(Website: Vendor_Website):Observable<any>{
    return this.httpClient.post<Vendor_Website>(`${this.apiUrl}Vendor/AddWebsite`,Website, this.httpOptions).pipe(map(result => result))
   } 
   AddLicense(License: Vendor_License):Observable<any>{
    return this.httpClient.post<Vendor_License>(`${this.apiUrl}Vendor/AddLicense`,License, this.httpOptions).pipe(map(result => result))
   } 
   AddAgreement(Agreement:Vendor_Agreement):Observable<any>{
    return this.httpClient.post<Vendor_Agreement>(`${this.apiUrl}Vendor/AddAgreement`,Agreement, this.httpOptions).pipe(map(result => result))
   } 
   AddInsurance(Insurance:Vendor_Insurance):Observable<any>{
    return this.httpClient.post<Vendor_Insurance>(`${this.apiUrl}Vendor/AddInsurance`,Insurance, this.httpOptions).pipe(map(result => result))
   } 
   AddPayTerms(PayTerms:Vendor_Payment_Terms):Observable<any>{
    return this.httpClient.post<Vendor_Payment_Terms>(`${this.apiUrl}Vendor/AddPayTerms`,PayTerms, this.httpOptions).pipe(map(result => result))
   } 
   AddRegistered(Registered:Vendor_Registration):Observable<any>{
    return this.httpClient.post<Vendor_Registration>(`${this.apiUrl}Vendor/AddRegistered`,Registered, this.httpOptions).pipe(map(result => result))
   } 
   AddVat(VAT:Vendor_Vat): Observable<any> {
    return this.httpClient.post<Vendor_Vat>(`${this.apiUrl}Vendor/AddVat`,VAT, this.httpOptions).pipe(map(result => result))
  }
  AddIncomeTax(IncomeTax:Vendor_Tax): Observable<any> {
    return this.httpClient.post<Vendor_Tax>(`${this.apiUrl}Vendor/AddIncomeTax`,IncomeTax, this.httpOptions).pipe(map(result => result))
  }
  /////put
  UpdateFax(FaxID:number,Fax:Vendor_Fax):Observable<any>{
    return this.httpClient.put<Vendor_Fax>(`${this.apiUrl}Vendor/UpdateFax/${FaxID}`,Fax, this.httpOptions).pipe(map(result => result))
   } 
   UpdateVat(VatID:number,VAT:Vendor_Vat): Observable<any> {
    return this.httpClient.put<Vendor_Vat>(`${this.apiUrl}Vendor/UpdateVat/${VatID}`,VAT, this.httpOptions).pipe(map(result => result))
  }
   UpdateWebsite(WebsiteID:number,Website: Vendor_Website):Observable<any>{
    return this.httpClient.put<Vendor_Website>(`${this.apiUrl}Vendor/UpdateWebsite/${WebsiteID}`,Website, this.httpOptions).pipe(map(result => result))
   } 
   UpdateLicense(LicenseID:number,License: Vendor_License):Observable<any>{
    return this.httpClient.put<Vendor_License>(`${this.apiUrl}Vendor/UpdateLicense/${LicenseID}`,License, this.httpOptions).pipe(map(result => result))
   } 
   UpdateAgreement(AgreementID:number,Agreement:Vendor_Agreement):Observable<any>{
    return this.httpClient.put<Vendor_Agreement>(`${this.apiUrl}Vendor/UpdateAgreement/${AgreementID}`,Agreement, this.httpOptions).pipe(map(result => result))
   } 

   UpdateInsurance(InsuranceID:number,Insurance:Vendor_Insurance):Observable<any>{
    return this.httpClient.put<Vendor_Insurance>(`${this.apiUrl}Vendor/UpdateInsurance/${InsuranceID}`,Insurance, this.httpOptions).pipe(map(result => result))
   } 

   UpdatePayTerms(PaymentTermsID:number,PayTerms:Vendor_Payment_Terms):Observable<any>{
    return this.httpClient.put<Vendor_Payment_Terms>(`${this.apiUrl}Vendor/UpdatePayTerms/${PaymentTermsID}`,PayTerms, this.httpOptions).pipe(map(result => result))
   } 

   UpdateRegistered(RegistrationID:number,Registered:Vendor_Registration):Observable<any>{
    return this.httpClient.put<Vendor_Registration>(`${this.apiUrl}Vendor/UpdateRegistered/${RegistrationID}`,Registered, this.httpOptions).pipe(map(result => result))
   } 
  UpdateIncomeTax(IncomeTaxID:number,IncomeTax:Vendor_Tax): Observable<any> {
    return this.httpClient.put<Vendor_Tax>(`${this.apiUrl}Vendor/UpdateIncomeTax/${IncomeTaxID}`,IncomeTax, this.httpOptions).pipe(map(result => result))
  }
//delete
  DeleteFaxByID(FaxID:number): Observable<any> {
    return this.httpClient.delete<Vendor_Fax>(`${this.apiUrl}Vendor/DeleteFaxByID/${FaxID}`, this.httpOptions).pipe(map(result => result))
  }
  DeleteVatByID(VatID:number): Observable<any> {
    return this.httpClient.delete<Vendor_Vat>(`${this.apiUrl}Vendor/DeleteVatByID/${VatID}`, this.httpOptions).pipe(map(result => result))
  }
  DeleteWebsiteByID(WebsiteID:number): Observable<any> {
    return this.httpClient.delete<Vendor_Website>(`${this.apiUrl}Vendor/DeleteWebsiteByID/${WebsiteID}`, this.httpOptions).pipe(map(result => result))
  }
  DeleteLicenseByID(LicenseID:number): Observable<any> {
    return this.httpClient.delete<Vendor_License>(`${this.apiUrl}Vendor/DeleteLicenseByID/${LicenseID}`, this.httpOptions).pipe(map(result => result))
  }
  DeleteAgreementByID(AgreementID:number): Observable<any> {
    return this.httpClient.delete<Vendor_Agreement>(`${this.apiUrl}Vendor/DeleteAgreementByID/${AgreementID}`, this.httpOptions).pipe(map(result => result))
  }
  DeleteInsuranceByID(InsuranceID:number): Observable<any> {
    return this.httpClient.delete<Vendor_Insurance>(`${this.apiUrl}Vendor/DeleteInsuranceByID/${InsuranceID}`, this.httpOptions).pipe(map(result => result))
  }
  DeletePaymentTerms(PaymentTermsID:number): Observable<any> {
    return this.httpClient.delete<Vendor_Payment_Terms>(`${this.apiUrl}Vendor/DeletePaymentTerms/${PaymentTermsID}`, this.httpOptions).pipe(map(result => result))
  }

  DeleteRegistrationByID(RegistrationID:number): Observable<any> {
    return this.httpClient.delete<Vendor_Registration>(`${this.apiUrl}Vendor/DeleteRegistrationByID/${RegistrationID}`, this.httpOptions).pipe(map(result => result))
  }
  DeleteIncomeTaxByID(IncomeTaxID:number): Observable<any> {
    return this.httpClient.delete<Vendor_Tax>(`${this.apiUrl}Vendor/DeleteIncomeTaxByID/${IncomeTaxID}`, this.httpOptions).pipe(map(result => result))
  }
  //end of vendor details

  //vendor files

    VendorFileAdd(FolderCategory:string,VendorNo:string,fileName:File):  Observable<any> {
      const formData = new FormData();
        formData.append('file', fileName);
        formData.append('FolderCategory', FolderCategory)
        formData.append('VendorNo', VendorNo)
      return this.httpClient.post<any>(`${this.apiUrl}Vendor/uploadVendorFile`,formData, this.httpOptions)
    }
    
    GetVendorFiles(FolderCategory:string,VendorNo:string,fileName:string): Observable<any> {
      return this.httpClient.post<any>(`${this.apiUrl}Vendor/GetVendorFiles/${FolderCategory}/${VendorNo}/${fileName}`, this.httpOptions)
    }

    DeleteVendorFile(FolderCategory:string,VendorNo:string,fileName:string): Observable<any> {
      return this.httpClient.delete<any>(`${this.apiUrl}Vendor/DeleteVendorFile/${FolderCategory}/${VendorNo}/${fileName}`, this.httpOptions)
    }
  //end of vendor files

  //Department
  // GetDepartments(): Observable<any> {
  //   return this.httpClient.get<Department[]>(`${this.apiUrl}Department/GetDepartments`).pipe(map(result => result))
  // }

  GetDepartment(Department_ID: number) {
    return this.httpClient.get(`${this.apiUrl}Department/GetDepartment` + '/' + Department_ID).pipe(map(result => result))
  }

  AddDepartments(AddDepartmentRequest: Department) {
    return this.httpClient.post<Department>(`${this.apiUrl}Department/CreateDepartment`, AddDepartmentRequest, this.httpOptions)
  }

  DeleteDepartment(Department_ID: Number): Observable<Department> {
    return this.httpClient.delete<Department>(`${this.apiUrl}Department/DeleteDepartment` + '/' + Department_ID, this.httpOptions)
  }

  EditDepartment(Department_ID: Number, UpdateDepartmentRequest: Department): Observable<Department> {
    return this.httpClient.put<Department>(`${this.apiUrl}Department/EditDepartment/${Department_ID}`, UpdateDepartmentRequest, this.httpOptions)
  }

  DepartmentValidation(name: String): Observable<Department> {
    return this.httpClient.get<Department>(`${this.apiUrl}Department/DepartmentValidation/` + name, this.httpOptions)
  }



  //Branch
  // GetBranches(): Observable<any> {
  //   return this.httpClient.get<Branch[]>(`${this.apiUrl}Branch/GetBranches`).pipe(map(result => result))
  // }

  // GetBranch(Branch_ID: number) {
  //   return this.httpClient.get(`${this.apiUrl}Branch/GetBranch`+'/' + Branch_ID).pipe(map(result => result))
  // }

  AddBranch(AddBranchRequest: Branch) {
    return this.httpClient.post<Branch>(`${this.apiUrl}Branch/CreateBranch`, AddBranchRequest, this.httpOptions)
  }

  DeleteBranch(Branch_ID: Number): Observable<Branch> {
    return this.httpClient.delete<Branch>(`${this.apiUrl}Branch/DeleteBranch` + '/' + Branch_ID, this.httpOptions)
  }

  EditBranch(Branch_ID: Number, UpdateBranchRequest: Branch): Observable<Branch> {
    return this.httpClient.put<Branch>(`${this.apiUrl}Branch/UpdateBranch/${Branch_ID}`, UpdateBranchRequest, this.httpOptions)
  }

  BranchValidation(name: String): Observable<Branch> {
    return this.httpClient.get<Branch>(`${this.apiUrl}Branch/BranchValidation/` + name, this.httpOptions)
  }

}

