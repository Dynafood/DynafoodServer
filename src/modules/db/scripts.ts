import { db_adm_conn } from "./index";

export const checkInputBeforeSqlQuery = (arg: string | null): string => {
    if (!arg) { return ''; }
    arg = arg.replaceAll("'", "''");

    return arg;
};