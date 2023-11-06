import { Asset } from "./Asset";
import { Procurement_Details } from "./ProcurementDetails";

export interface Procurement_Asset {
    procurement_Asset_ID:number;
    procurement_Details_ID:number;
    asset_ID:number;
    procurement_Details:Procurement_Details;
    asset:Asset
}