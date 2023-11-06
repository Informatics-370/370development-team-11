import { Consumable } from "./Consumable";
import { Procurement_Details } from "./ProcurementDetails";

export interface Procurement_Consumable {
    procurement_Consumable_ID:number;
    procurement_Details_ID:number;
    consumable_ID:number;
    procurement_Details:Procurement_Details;
    consumable:Consumable;
    quantity:number;

}