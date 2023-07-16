import { HelpCategory } from "./HelpCategory";

export interface Help{
    help_ID: Number;
    help_Category_ID: Number;
    helpCategory: HelpCategory;
    name: String;
    video: String;
    description: String;
    user_Manual: String;
}

