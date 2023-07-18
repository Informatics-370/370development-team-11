import {VendorOnboardRequest} from "./VendorOnboardRequest";

export interface VendorOnboardRequestVM {
    onboard_Request_Id : number;
    vendor_ID: number;
    onboard_Request_status_ID:number;
    employeeName: string;
    vendors: VendorOnboardRequest;
    quotes: string;
}