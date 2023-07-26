import { Consumable } from "./Consumable";
import { VendorOnboardRequest } from "./VendorOnboardRequest";

export interface Vendor_Consumable{ 
    vendor_Consumbale_ID:number;
    consumable_ID:number;
    vendor_ID:number;
    consumable:Consumable;
    vendor:VendorOnboardRequest;
}