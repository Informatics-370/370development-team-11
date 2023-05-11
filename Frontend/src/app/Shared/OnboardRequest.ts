import { User } from "./User";
import {VendorOnboardRequest} from "./VendorOnboardRequest";

export interface OnboardRequest {
    onboard_Request_Id : number;
    user_Id : number;
    vendor_ID: number;
    vendor: VendorOnboardRequest;
    users : User
    quotes: string;

}