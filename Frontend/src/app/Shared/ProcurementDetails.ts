import { Employee } from "./Employee";
import { Procurement_Request } from "./Procurement_Request";
import { Sign_Off_Status } from "./SignOffStatus";
import { Procurement_Payment_Status } from "./ProcurementPaymentStatus";
import { BudgetLine } from "./BudgetLine";
import { Procurement_Status } from "./ProcurementStatus";
import { Payment_Method } from "./PaymentMethod";
import { Branch } from "./Branch";

export interface Procurement_Details {
     procurement_Details_ID: number;
     employeeID: Number;
     procurement_Request_ID: number;
     sign_Off_Status_ID: number;
     procurement_Payment_Status_ID: number;
     BudgetLineId: number;
     procurement_Status_ID: number;
     payment_Method_ID: number;
     branch_ID: number;
     branch:Branch;
     employee: Employee;
     procurement_Request: Procurement_Request;
     sign_Off_Status: Sign_Off_Status;
     procurement_Payment_Status: Procurement_Payment_Status;
     budget_Line: BudgetLine;
     procurement_Status: Procurement_Status;
     payment_Method: Payment_Method;
     item_Type: string;
     buyer_Name: string;
     buyer_Email: string;
     deposit_Required: boolean;
     full_Payment_Due_Date: Date;
     total_Amount: Number;
     payment_Made: boolean;
     comment: string;
     proof_Of_Payment_Required: boolean;
     itemReceived: boolean;

}
