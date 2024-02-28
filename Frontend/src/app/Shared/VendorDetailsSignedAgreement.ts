import { VendorDetails } from "./VendorDetails"

export interface Vendor_Agreement {
    agreement_ID: number,
    vendor_Detail_ID: number,
    vendor_Detail: VendorDetails
    signed_Agreement_Doc:string
} 