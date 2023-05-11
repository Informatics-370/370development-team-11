import { Role } from "./EmployeeRole";

export interface User {
  User_Id: Number;
  Role_ID: Number;
  Username: String;
  Password: String;
  Profile_Picture: String;
  role: Role;
}
