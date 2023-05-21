import { VendorStatus } from "./VendorStatus";

export interface VendorOnboardRequest {
    vendor_ID : number;
    vendor_Status_ID: number;
    vendor_Status: VendorStatus
    name: string;
    email: string;
    number_Of_Times_Used: number;
    sole_Supplier_Provided: boolean;
}