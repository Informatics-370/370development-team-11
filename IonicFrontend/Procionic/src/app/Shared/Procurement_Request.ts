import { Requisition_Status } from "./Requisition_Status";
import { User } from "./User";
import { VendorOnboardRequest } from "./VendorOnboardRequest";


export interface Procurement_Request {
    procurement_Request_ID: Number;
    vendor_ID: Number;
    vendor: VendorOnboardRequest;
    requisition_Status_ID: Number;
    requisition_Status: Requisition_Status;
    user_ID: Number;
    user: User;
    name: String;
    description: String;
}