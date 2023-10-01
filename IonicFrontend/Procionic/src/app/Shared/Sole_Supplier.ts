import { VendorOnboardRequest } from "./VendorOnboardRequest";


export interface SoleSupplier {

    sole_Supplier_ID: number;
    vendor_ID: number;
    vendor: VendorOnboardRequest
    mD_Approval : boolean;
    date: Date;
    reason : string;
}