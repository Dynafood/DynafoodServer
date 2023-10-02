import { db_adm_conn } from "./index";

export const checkInputBeforeSqlQuery = (arg: string | null): string => {
    if (!arg) { return ''; }
    arg = arg.replaceAll("'", "''");

    return arg;
};

export const isUUID = (to_check: string): boolean => {
    const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[4][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
    return uuidRegex.test(to_check);
  }