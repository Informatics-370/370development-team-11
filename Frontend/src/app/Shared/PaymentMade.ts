import { Procurement_Details } from "./ProcurementDetails";

export interface Payment_Made {
     payment_Made_ID:number;
     procurement_Details_ID :number;
     procurement_Details:Procurement_Details; 
     paid_On_Date:Date;
     receipt_Upload:string;
}