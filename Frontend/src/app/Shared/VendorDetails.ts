import { Vendor_Category } from "./VendorCategory"
import { VendorOnboardRequest } from "./VendorOnboardRequest"
export interface VendorDetails {
        //titles max 3
        vendor_Detail_ID:number
        vendor_Category_ID:number
        vendor_ID:number
        vendor_Category:Vendor_Category
        vendor:VendorOnboardRequest
        telephone_Num:string
        contact_Person_Title:string
        contact_Person_Name:string
        contact_Person_ContactNum:string
        contact_Person_Email:string
        registered_Address:string
        faxProvided: boolean
        websiteProvided:boolean
        description_GSP:string

        vatRegistered:boolean
        registration_Provided:boolean
        income_Tax_Num_Provided:boolean
        soleSupplierProvided:boolean
        pOPIA_Provided:boolean
        payment_Terms_Provided:boolean
        insurance_Provided:boolean
        signed_Agreement_Provided:boolean
        license_Num_Provided:boolean
        
        bank_Name:string
        account_Holder:string
        bank_Account_Number:string
        branch_Code:string
        account_Type:string
        bank_Contact_Name:string
        bank_Contact_PhoneNum:string
        bankStampedConfirtmation:string
        beeRegistered:boolean
        dueDIllegenceRequired:boolean
        dateAccepted:Date
}//add account holder and dateAccepted