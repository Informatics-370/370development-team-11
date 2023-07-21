import { Procurement_Details } from "./ProcurementDetails";

export interface Payment_Made {
     Payment_Made_ID:number;
     procurement_Details_ID :number;
     procurement_Details:Procurement_Details; 
     Paid_On_Date:Date;
     Receipt_Upload:string;
}