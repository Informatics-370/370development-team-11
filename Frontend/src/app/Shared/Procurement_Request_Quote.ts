import { Procurement_Request } from "./Procurement_Request";

export interface Procurement_Request_Quote {
    quote_ID: Number;
    procurement_Request_ID: Number;
    procurement_Request: Procurement_Request;
    path: String;
    upload_Date: Date;
}