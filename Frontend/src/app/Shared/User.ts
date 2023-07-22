import { Role } from "./EmployeeRole";

export interface User {
  user_Id: Number;
  role_ID: Number;
  username: String;
  password: String;
  profile_Picture: String;
  no_Notifications: Number;
  role: Role;
}
