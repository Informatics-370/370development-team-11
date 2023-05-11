import { Branch } from "./Branch";
import { Department } from "./Department";
import { Mandate_Limit } from "./MandateLimit";
import { User } from "./User";

export interface Employee {
  employeeID: Number;
  user_Id: Number;
  department_ID: Number;
  branch_ID: Number;
  mandate_ID: Number;
  employeeName: String;
  employeeSurname: String;
  cellPhone_Num: String;
  email: String;
  branch: Branch;
  department: Department;
  user: User;
  mandate_limit: Mandate_Limit;
}
