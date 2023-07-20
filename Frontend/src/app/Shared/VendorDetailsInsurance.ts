import { Vendor_Insurance_Type } from "./VendorInsuranceType"
import { VendorOnboardRequest } from "./VendorOnboardRequest"

export interface Vendor_Insurance {
    insurance_ID: number,
    vendor_ID: number,
    vendor:VendorOnboardRequest,
    vendor_Insurance_Type_ID:number,
    vendor_Insurance_Type: Vendor_Insurance_Type,
    confirmation_Doc:string
} 