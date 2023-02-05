import { checkInputBeforeSqlQuery } from './scripts';
import { db_adm_conn } from './index';
import { QueryResult, QueryResultRow } from 'pg';

export const getRestrictionIdByName = async (restrictionName: string) : Promise<string | null> => {
    const restrictionID : QueryResult = await db_adm_conn.query(`
        SELECT restrictionID
        FROM Restriction
        WHERE eng_name = '${checkInputBeforeSqlQuery(restrictionName)}'
    `);
    if (restrictionID.rowCount === 0) { return null; }
    return restrictionID.rows[0].restrictionid;
};

export const userHasRestriction = async (userid: string, restrictionid: string) : Promise<boolean> => {
    const restriction : QueryResult = await db_adm_conn.query(`
            SELECT * FROM EndUser_Restriction
            WHERE endUserID = '${checkInputBeforeSqlQuery(userid)}'
            AND restrictionID = '${checkInputBeforeSqlQuery(restrictionid)}'
        `);
    return restriction.rowCount > 0;
};

export const getAlertSettings = async (userid: string) : Promise<Array<QueryResultRow>> => {
    const result: QueryResult = await db_adm_conn.query(`
    SELECT R.eng_name as restrictionName, ER.alertActivation
    FROM Restriction R
    LEFT JOIN EndUser_Restriction ER ON ER.restrictionID = R.restrictionID
    WHERE ER.endUserID = '${checkInputBeforeSqlQuery(userid)}';`);
    return result.rows;
};

export const createSetting = async (alertActivation: string, userid: string, restrictionid:string) => {
    await db_adm_conn.query(`
            INSERT INTO EndUser_Restriction (alertActivation, endUserId, restrictionID)
            SELECT
                ${checkInputBeforeSqlQuery(alertActivation)},
                '${checkInputBeforeSqlQuery(userid)}',
                '${checkInputBeforeSqlQuery(restrictionid)}'
            WHERE NOT EXISTS (SELECT * FROM EndUser_Restriction EU
            WHERE EU.endUserID = '${checkInputBeforeSqlQuery(userid)}'
            AND EU.restrictionID = '${checkInputBeforeSqlQuery(restrictionid)}');
        `);
};

export const updateAlertSetting = async (userid: string, alertActivation: string, restrictionID: string) => {
    await db_adm_conn.query(`
    UPDATE EndUser_Restriction
    SET alertActivation = ${checkInputBeforeSqlQuery(alertActivation)}
    WHERE restrictionID = '${checkInputBeforeSqlQuery(restrictionID)}'
    AND endUserID = '${checkInputBeforeSqlQuery(userid)}';
        `);
};

export const deleteAlertSetting = async (userid: string, restrictionID: string) : Promise<void> => {
    await db_adm_conn.query(`
            DELETE FROM EndUser_Restriction
            WHERE restrictionID = '${checkInputBeforeSqlQuery(restrictionID)}'
            AND endUserID = '${checkInputBeforeSqlQuery(userid)}';
        `);
};
