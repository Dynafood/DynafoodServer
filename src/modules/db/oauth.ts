import { QueryResultRow } from 'pg';
import { db_adm_conn } from './index';
import { checkInputBeforeSqlQuery } from './scripts';

export const getProviderByName = async (name: string): Promise<QueryResultRow> => {
    const provider = await db_adm_conn.query(`
        SELECT oAuthProviderID FROM OAuthProvider
        WHERE lower(oAuthProviderName) = lower('${checkInputBeforeSqlQuery(name)}')
    `);

    return provider.rows[0];
}
