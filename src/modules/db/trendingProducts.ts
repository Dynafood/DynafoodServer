import { QueryResultRow } from "pg"
import { db_adm_conn } from '.';
import { checkInputBeforeSqlQuery } from './scripts';

export const getTrendingLocal = async (count: number, country_code: string): Promise<Array<QueryResultRow>> => {
    const res = await db_adm_conn.query(`
        SELECT * FROM (
            SELECT barcode, productName, productImageLink, COUNT(*) as product_count 
            FROM TrendingProduct
            WHERE cc = '${checkInputBeforeSqlQuery(country_code)}'
            GROUP BY barcode, productName, productImageLink
        ) inline_table ORDER BY product_count DESC
        LIMIT ${count};
    `);
    return res.rows;
}

export const getTrendingGlobal = async (count: number): Promise<Array<QueryResultRow>> => {
    const res = await db_adm_conn.query(`
        SELECT * FROM (
            SELECT barcode, productName, productImageLink, COUNT(*) as product_count 
            FROM TrendingProduct
            GROUP BY barcode, productName, productImageLink
        ) inline_table ORDER BY product_count DESC
        LIMIT ${count};
    `);
    return res.rows;
}
