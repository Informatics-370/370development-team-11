import { BudgetCategory } from "./BudgetCategory";
import { BudgetAllocation } from "./BudgetAllocation";

export interface BudgetLine {
  budgetLineId: Number;
  budget_ID?: Number;
  category_ID: Number;
  account_Code: String;
  budget_Allocation?: BudgetAllocation;
  budget_Category: BudgetCategory;
  month: String;
  budgetAmt: Number;
  actualAmt: Number;
  variance: Number;
}
