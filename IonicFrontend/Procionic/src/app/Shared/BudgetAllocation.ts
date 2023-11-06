import { Department } from "./Department";

export interface BudgetAllocation {
    budget_ID: Number;
    department_ID: Number;
    department: Department;
    date_Created: String;
    year: Number;
    total: Number;
}