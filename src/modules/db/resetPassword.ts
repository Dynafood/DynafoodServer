import { checkInputBeforeSqlQuery } from './scripts';
import { db_adm_conn } from './index';

export const updatePassword = async (email: string, newPassword: string, code: string) : Promise<string> => {
    let error_message = ""
    const db_response = await db_adm_conn.query(`
            UPDATE endUser
            SET passcode = '${newPassword}', password_reset_token = null
            WHERE lower(email) = lower('${checkInputBeforeSqlQuery(email)}') and password_reset_token = '${checkInputBeforeSqlQuery(code)}';
        `);
    if (db_response.rowCount == 0) {
        error_message = "Email and Token do not match"
    }
    return "";
};
