import { Notification_Type } from "./Notification_Type";
import { User } from "./User";

export interface Notification {
  notification_ID: Number;
  notification_Type_ID: Number;
  user_ID: Number;
  name: String;
  send_Date: Date;
  user: User;
  notification_Type: Notification_Type
}
