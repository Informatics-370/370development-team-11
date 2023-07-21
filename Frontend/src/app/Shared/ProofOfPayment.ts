import { Procurement_Details } from "./ProcurementDetails";

export interface Proof_Of_Payment {
    Proof_Of_Payment_ID:number;
    procurement_Details_ID:number;
    procurement_Details:Procurement_Details; 
    Proof_Of_Payment_Doc:string;
}