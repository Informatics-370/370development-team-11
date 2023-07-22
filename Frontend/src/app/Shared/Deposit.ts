import { Procurement_Details } from "./ProcurementDetails";

export interface Deposit {
     procurement_Deposit_ID:number;
     procurement_Details_ID:number;
     procurement_Details:Procurement_Details; 
     deposit_Due_Date:Date;
     deposit_Amount:Number;
     amount_Outstanding:Number;
}