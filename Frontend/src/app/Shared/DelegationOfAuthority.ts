import { Admin } from "./Admin";
import { DelegationStatus } from "./DelegationStatus"
import { User } from "./User";

export interface Delegation_Of_Authority {
  delegation_ID: Number;
  user_Id: Number;
  admin_ID: Number;
  delegationStatus_ID: Number;
  from_Date: Date;
  to_Date: Date;
  delegation_Document: String;
  delegatingParty: String;
  user: User;
  admin: Admin;
  delegation_Status: DelegationStatus;
}
