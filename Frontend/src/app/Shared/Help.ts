import { Help_Category } from "./HelpCategory";

export interface Help{
    help_ID: Number;
    help_Category_ID: Number;
    help_Category: Help_Category;
    name: String;
    video: String;
    description: String;
    user_Manual: String;
}

