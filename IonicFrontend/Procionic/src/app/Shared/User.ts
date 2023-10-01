import { Access } from "./Access";
import { Role } from "./EmployeeRole";

export interface User {
  user_Id: Number;
  role_ID: Number;
  access_ID: Number;
  username: String;
  password: String;
  profile_Picture: String;
  no_Notifications: Number;
  no_VenNotifications: Number;
  no_InvNotifications: Number;
  no_DelNotifications: Number;
  no_ProNotifications: Number;
  role: Role;
  access: Access;
}
