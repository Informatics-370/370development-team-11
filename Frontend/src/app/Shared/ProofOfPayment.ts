import { Procurement_Details } from "./ProcurementDetails";

export interface Proof_Of_Payment {
    proof_Of_Payment_ID:number;
    procurement_Details_ID:number;
    procurement_Details:Procurement_Details; 
    proof_Of_Payment_Doc:string;
}