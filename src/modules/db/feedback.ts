
import { Md5 } from 'ts-md5';
import { db_adm_conn } from '.';
import { checkInputBeforeSqlQuery } from './scripts';

export const createNewFeedback = async (reason: string, content: string, userid: string) => {
    await db_adm_conn.query(`
            INSERT INTO Feedback (reason, content, userhash)
            VALUES ('${checkInputBeforeSqlQuery(reason)}', '${checkInputBeforeSqlQuery(content)}', '${checkInputBeforeSqlQuery(Md5.hashStr(userid))}');
        `);
}