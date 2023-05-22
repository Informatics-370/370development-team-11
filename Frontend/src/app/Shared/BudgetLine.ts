import { BudgetCategory } from "./BudgetCategory";
import { BudgetAllocation } from "./BudgetAllocation";

export interface BudgetLine {
    budget_ID?: Number;
    category_ID: Number;
    account_Code: Number;
    budget_Allocation?: BudgetAllocation;
    budget_Category: BudgetCategory;
    month: String;
    budgetAmt: Number;
    actualAmt: Number;
    variance: Number;
}