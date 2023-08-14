import { Consumable } from "./Consumable";

export interface Consumable_History {
    history_ID: Number;
    Consumable_ID: Number;
    consumable: Consumable;
    stockAmt: Number;
    dateCaptured: Date;
}