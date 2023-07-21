import { Procurement_Details } from "./ProcurementDetails";

export interface Deposit {
     procurement_Deposit_ID:number;
     procurement_Details_ID:number;
     procurement_Details:Procurement_Details; 
     peposit_Due_Date:Date;
     peposit_Amount:Number;
     amount_Outstanding:Number;
}