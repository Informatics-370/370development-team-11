import { Onboard_Status } from "./OnboardStatus";
import { User } from "./User";
import {VendorOnboardRequest} from "./VendorOnboardRequest";

export interface OnboardRequest {
    onboard_Request_Id : number;
    user_Id : number;
    vendor_ID: number;
    status_ID: number;
    vendor: VendorOnboardRequest;
    onboard_Status: Onboard_Status;
    users : User
    quotes: string;

}