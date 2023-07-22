import { Contracted_Partner_Type } from "./ContractedPartnerType";
import { Due_Dillegence } from "./DueDillegence";



export interface POPI{
    pOPI_ID:number;
    contracted_Partner_Type_ID:number;
    due_Diligence_ID:number;
    due_Dillegence: Due_Dillegence;
    contracted_Partner_Type: Contracted_Partner_Type;
    personal_Data_Purpose: boolean;
    dataProcessing_JointController_Agreement: boolean;
    confidentiality_Importance_Highlighted: boolean;
    contract_Audits_Provisions_Provided: boolean;
    activity_Liability_Present: boolean;
    third_Party_Data_Processing_Provisioned: boolean;
    contract_End_Data_Management_Provided: boolean;
    personal_Data_Processing_Details_Present: boolean;
    processing_Activities_Certification_Held: boolean;
}
