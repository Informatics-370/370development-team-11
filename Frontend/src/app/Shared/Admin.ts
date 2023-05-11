import { User } from "./User";

export interface Admin {
  Admin_ID: Number;
  User_Id: Number;
  AdminName: String;
  AdminSurname: String;
  CellPhone_Num: String;
  Email: String;
  user: User;
}
