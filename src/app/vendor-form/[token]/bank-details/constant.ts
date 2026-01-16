import z from "zod/v3";


export const accounttypeEnum = z.enum(["Saving", "Current"]) ;
export const Account_Type =["Saving", "Current"] as const;

