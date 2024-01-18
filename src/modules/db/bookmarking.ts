import { db_adm_conn } from './index';
import { checkInputBeforeSqlQuery } from './scripts';

export const create = async (barcode: string, userid: string): Promise<number> => {
    const result = await db_adm_conn.query(`
    UPDATE public.history
	SET bookmarked=true
	WHERE 
        enduserid='${checkInputBeforeSqlQuery(userid)}' 
        and 
        barcode='${checkInputBeforeSqlQuery(barcode)}';
    `);
    return result.rowCount
};

export const remove = async (barcode: string, userid: string): Promise<number> => {
    const result = await db_adm_conn.query(`
    UPDATE public.history
	SET bookmarked=false
	WHERE 
        enduserid='${checkInputBeforeSqlQuery(userid)}' 
        and 
        barcode='${checkInputBeforeSqlQuery(barcode)}';
    `);
    return result.rowCount
};

export const check = async (barcode: string, userid: string): Promise<boolean> => {
    const result = await db_adm_conn.query(`
    SELECT bookmarked from history
	WHERE 
        enduserid='${checkInputBeforeSqlQuery(userid)}' 
        and 
        barcode='${checkInputBeforeSqlQuery(barcode)}';
    `);
    return result.rows[0].bookmarked
}