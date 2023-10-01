import { User } from "./User";

export interface Admin {
  admin_ID: Number;
  user_Id: Number;
  adminName: String;
  adminSurname: String;
  cellPhone_Num: String;
  email: String;
  user: User;
}
