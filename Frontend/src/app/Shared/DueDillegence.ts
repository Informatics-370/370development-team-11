
import { VendorOnboardRequest } from "./VendorOnboardRequest";

export interface Due_Dillegence{

    due_Diligence_ID:number;
    vendor_ID:number;
    vendor: VendorOnboardRequest
    due_Diligence_Doc: boolean;
    mutual_Nda_Signed: boolean;
    basic_Company_Info_Provided: boolean;
    group_Structure_Provided: boolean;
    income_Tax_Number_Provided: boolean;
    tax_Clearance_Certificate_Provided: boolean;
    vat_Number_Provided: boolean;
    vat_Reg_Certificate_Provided: boolean;
    company_Reg_Doc_Provided: boolean;
    letter_Of_Good_Standing_Provided: boolean;
    b_BBEE_Certificate_Provided: boolean;
    direcor_Details_Provided: boolean;
    company_Resolution_Agreement_Provided: boolean;
    subcontractor_Name_Provided: boolean;
    company_Details_Provided: boolean;
    individual_Details_Provided: boolean;
    general_Liability_Insurance_Present: boolean;
    cyber_Insurance_Present: boolean;
    proffesional_Indemnity_Insurance_Present: boolean;
    other_Insurance_Required: boolean;
    licenses_Required: boolean;
    accreditation_Required: boolean;
    proffesional_Membership_Required: boolean;
    business_Continuity_Present: boolean;
    dIsaster_Recovery_Plan_Present: boolean;
    popI_Present: boolean;
    data_Security_Breaches_Present: boolean;
    site_Visits_Present: boolean;
    information_Security_Policy_Present: boolean;
    privacy_Policy_Present_Present: boolean;
    data_Retention_Destruction_Policy_Present: boolean;
    anti_Bribery_Corruption_Policy_Present: boolean;
    ethics_Policy_Present: boolean;
    conflict_Of_Interest_Policy_Present: boolean;
    customer_Complaints_Policy_Present: boolean;
    business_References_Present: boolean;
    bank_Stamped_Confirtmation:boolean;
}
