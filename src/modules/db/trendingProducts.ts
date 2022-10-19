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

export const insert = async (userID: string, barcode: string, productName: string, imageLink: string): Promise<void> => {
    const res = await db_adm_conn.query(`
        SELECT country_code FROM EndUser
        WHERE enduserid = '${userID}'
    `);

    const cc = res.rows[0].country_code;
    await db_adm_conn.query(`
        INSERT INTO TrendingProduct (barcode, cc, productName, productImageLink)
        VALUES (
            '${checkInputBeforeSqlQuery(barcode)}',
            '${checkInputBeforeSqlQuery(cc)}',
            '${checkInputBeforeSqlQuery(productName)}',
            '${checkInputBeforeSqlQuery(imageLink)}'
        );
    `);
}

export const getCountryCode = async (userID: string): Promise<string> => {
    const res = await db_adm_conn.query(`
        SELECT country_code FROM EndUser
        WHERE endUserID = '${userID}';
    `);

    return res.rows[0].country_code;
}
