export const checkInputBeforeSqlQuery = (arg: string | null): string => {
    if (!arg)
        return ""
    arg = arg.replace("'", "''");

    return arg;
};
