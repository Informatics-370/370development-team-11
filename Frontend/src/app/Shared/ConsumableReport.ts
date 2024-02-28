import { Consumable } from './Consumable';
import { ConsumableCategory } from './ConsumableCategory';
import { Consumable_History } from './Consumable_History';

export interface ReportData {
    consumables: ConsumableWithHistory[];
}
interface ConsumableWithHistory extends Consumable {
    name: string;
    consumable_ID: Number;
    consumable_Category_ID: Number;
    description: String;
    on_Hand: Number;
    minimum_Reorder_Quantity: Number;
    maximum_Reorder_Quantity: Number;
    consumable_Category: ConsumableCategory;
}