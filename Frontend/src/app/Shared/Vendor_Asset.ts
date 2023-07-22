import { Asset } from "./Asset";
import { VendorOnboardRequest } from "./VendorOnboardRequest";

export interface Vendor_Asset {
    vendor_Asset_ID:number;
    asset_ID:number;
    vendor_ID:number;
    asset:Asset;
    vendor:VendorOnboardRequest;
}