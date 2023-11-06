import { ConsumableCategory } from "./ConsumableCategory";

export interface Consumable {
    consumable_ID: Number;
    consumable_Category_ID: Number;
    name: String;
    description: String;
    on_Hand: Number;
    minimum_Reorder_Quantity: Number;
    maximum_Reorder_Quantity: Number;
    consumable_Category: ConsumableCategory
}