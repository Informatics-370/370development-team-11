import { VendorDetails } from "./VendorDetails"

export interface Vendor_Payment_Terms {
    payment_Terms_ID: number,
    vendor_Detail_ID: number,
    vendor_Detail: VendorDetails
    payment_Terms:string
} 