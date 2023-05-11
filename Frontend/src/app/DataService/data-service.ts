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
import { OnboardRequest } from '../Shared/OnboardRequest';
import { VendorOnboardRequestVM } from '../Shared/VendorOnboardRequestVM';
import { VendorOnboardRequest } from '../Shared/VendorOnboardRequest';

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
    return this.httpClient.put(`${this.apiUrl}Role/EditRole/${roleID}`, role, this.httpOptions)
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

  ConsumableValidation(name: String): Observable<Consumable> {
    return this.httpClient.get<Consumable>(`${this.apiUrl}Consumable/ConsumableValidation/` + name, this.httpOptions)
  }
  GetBranches(): Observable<any> {
    return this.httpClient.get<Branch[]>(`${this.apiUrl}Branch/GetAllBranches`).pipe(map(result => result))
  }

  GetDepartments(): Observable<any> {
    return this.httpClient.get<Department[]>(`${this.apiUrl}Department/GetAllDepartments`).pipe(map(result => result))
  }

  AddUser(user: User, name: string) {
    return this.httpClient.post(`${this.apiUrl}User/CreateUser?name=${name}`, user, this.httpOptions)
  }

  AddEmployee(emp: Employee, usrName: string, brName: string, depName: string, mlAmount: number) {
    return this.httpClient.post(`${this.apiUrl}User/CreateEmployee?usrName=${usrName}&brName=${brName}&depName=${depName}&mlAmount=${mlAmount}`, emp, this.httpOptions)
  }

  GetEmployee(userID: number) {
    return this.httpClient.get(`${this.apiUrl}User/GetEmployee` + "/" + userID).pipe(map(result => result))
  }

  GetBranch(Branch_ID: number) {
    return this.httpClient.get(`${this.apiUrl}Branch/GetBranch` + Branch_ID).pipe(map(result => result))
  }

  EditUser(usr: User, userID: number) {
    return this.httpClient.put(`${this.apiUrl}User/EditUser/${userID}`, usr, this.httpOptions)
  }

  EditEmployee(emp: Employee, userID: number) {
    return this.httpClient.put(`${this.apiUrl}User/EditEmployee/${userID}`, emp, this.httpOptions)
  }

  DeleteEmployee(userID: number) {
    return this.httpClient.delete<string>(`${this.apiUrl}User/DeleteEmployee` + "/" + userID, this.httpOptions)
  }

  DeleteUser(userID: number) {
    return this.httpClient.delete<string>(`${this.apiUrl}User/DeleteUser` + "/" + userID, this.httpOptions)
  }

  GetAdmins(): Observable<any> {
    return this.httpClient.get<Admin[]>(`${this.apiUrl}User/GetAdmins`).pipe(map(result => result))
  }

  GetAdmin(userID: number) {
    return this.httpClient.get(`${this.apiUrl}User/GetAdmin` + "/" + userID).pipe(map(result => result))
  }

  AddAdmin(adm: Admin, usrName: string) {
    return this.httpClient.post(`${this.apiUrl}User/CreateAdmin?usrName=${usrName}`, adm, this.httpOptions)
  }

  EditAdmin(adm: Admin, userID: number) {
    return this.httpClient.put(`${this.apiUrl}User/EditAdmin/${userID}`, adm, this.httpOptions)
  }

  DeleteAdmin(userID: number) {
    return this.httpClient.delete<string>(`${this.apiUrl}User/DeleteAdmin` + "/" + userID, this.httpOptions)
  }

  GetAllOnboardRequest(): Observable<any> {
    return this.httpClient.get<VendorOnboardRequestVM[]>(`${this.apiUrl}OnboardRequest/GetAllOnboardRequest`).pipe(map(result => result))
  }

  AddOnboardRequest(AddRequest : OnboardRequest) {
    return this.httpClient.post(`${this.apiUrl}OnboardRequest/CreateOnboardRequest`, AddRequest, this.httpOptions)
  }

  GetVendorsRequest() {
    return this.httpClient.get<VendorOnboardRequest[]>(`${this.apiUrl}OnboardRequest/GetVendors`).pipe(map(result => result))
  }

  GetRequest() {
    return this.httpClient.get<OnboardRequest[]>(`${this.apiUrl}OnboardRequest/GetVendors`).pipe(map(result => result))
  }

}

