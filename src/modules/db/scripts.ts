export const checkInputBeforeSqlQuery = (arg: string): string => {
    arg = arg.replace("'", "''");

    return arg;
}
