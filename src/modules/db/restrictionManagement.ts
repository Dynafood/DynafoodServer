import db_adm_conn from ".";
import { QueryResult } from "pg";
import { checkInputBeforeSqlQuery } from "./scripts";

export const restrictionIdByName = async (name: string) : Promise<string | null> => {
    let restrictionID : QueryResult = await db_adm_conn.query(`
            SELECT restrictionID
            FROM Restriction
            WHERE restrictionName = '${checkInputBeforeSqlQuery(name)}'
        `);
    if (restrictionID.rowCount == 0) {
        return null
    }
    return restrictionID.rows[0].restrictionID
}

export const userHasRestriction = async (userid: string, restrictionID: string) : Promise<boolean> => {
    let restriction : QueryResult = await db_adm_conn.query(`
            SELECT * FROM EndUser_Restriction
            WHERE endUserID = '${checkInputBeforeSqlQuery(userid)}'
            AND restrictionID = '${checkInputBeforeSqlQuery(restrictionID)}'
        `)
    if (restriction.rowCount == 0) {
        return false
    }
    return true
}