import { db_adm_conn } from '.';
import { checkInputBeforeSqlQuery } from './scripts';

export const updatePassword = async (userid: string, newPassword: string) => {
    await db_adm_conn.query(`
            UPDATE endUser
            SET passcode = '${newPassword}'
            WHERE endUserID = '${checkInputBeforeSqlQuery(userid)}';
        `);
}
