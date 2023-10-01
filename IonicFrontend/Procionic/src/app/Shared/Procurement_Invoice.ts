import { Procurement_Details } from "./ProcurementDetails";

export interface Procurement_Invoice {
    invoice_ID: number;
    path: string;
    date_Uploaded: Date;
    procurement_Details_ID: number;
    procurement_Details: Procurement_Details;
}