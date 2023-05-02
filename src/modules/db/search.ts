import { checkInputBeforeSqlQuery } from './scripts';
import { db_adm_conn } from './index';
import { QueryResult, QueryResultRow } from 'pg';

export const getAllergenbyName = async (name: string, language: string) : Promise<Array<string>> => {
    const escaped_search = checkInputBeforeSqlQuery(name);
    language = 'category_name'
    const ret = await db_adm_conn.query(`
        SELECT ${language}, SIMILARITY(${language}, '${escaped_search}') as Similarity
        FROM own_restriction
        WHERE 
            SIMILARITY(${language}, '${escaped_search}') > (SELECT value FROM global_variables WHERE key = 'search_precision')::DECIMAL
            OR ${language} LIKE '${escaped_search}%'
        ORDER BY Similarity DESC`
    );
    return ret.rows.map((obj) => obj[language])
} 

export const directQuery = async (query: string): Promise<any> => {
    return (await db_adm_conn.query(query))
}