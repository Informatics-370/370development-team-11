import { Branch } from "./Branch";
import { Department } from "./Department";
import { Mandate_Limit } from "./MandateLimit";
import { User } from "./User";

export interface Employee {
  EmployeeID: Number;
  User_Id: Number;
  Department_ID: Number;
  Branch_ID: Number;
  Mandate_ID: Number;
  EmployeeName: String;
  EmployeeSurname: String;
  CellPhone_Num: String;
  Email: String;
  branch: Branch;
  department: Department;
  user: User;
  mandate_limit: Mandate_Limit;
}
