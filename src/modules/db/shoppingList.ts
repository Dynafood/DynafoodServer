import { checkInputBeforeSqlQuery } from './scripts';
import { db_adm_conn } from './index';
import { QueryResult, QueryResultRow } from 'pg';

export const createShoppingList = async (name: string, userid: string) => {
    await db_adm_conn.query(`
            INSERT INTO ShoppingList (endUserId, listName)
            VALUES ('${checkInputBeforeSqlQuery(userid)}', '${checkInputBeforeSqlQuery(name)}');
        `);
};

//later create units which can be used
export const createShoppingListItem = async (itemName: string, listID: string, barcode: string | null, quantity: number | null) => {
    await db_adm_conn.query(`
            INSERT INTO ShoppingListItem (listID, productName, barcode, quantity, done)
            VALUES ('${checkInputBeforeSqlQuery(listID)}', '${checkInputBeforeSqlQuery(itemName)}', '${checkInputBeforeSqlQuery(barcode)}', '${quantity}', false);
        `);
    
};

export const deleteShoppingList = async (listID: string, userid: string) => {
    await db_adm_conn.query(`
    DELETE
    FROM ShoppingList
    WHERE listID = '${checkInputBeforeSqlQuery(listID)}'
        AND enduserId = '${checkInputBeforeSqlQuery(userid)}';`);
};

export const deleteShoppingListItem = async (itemID: string, userid: string) => {

    const response : QueryResult = await db_adm_conn.query(`
        SELECT itemID
        FROM ShoppingListItem sli
        JOIN ShoppingList sl ON sl.listID = sli.listID
        WHERE sl.enduserId = '${checkInputBeforeSqlQuery(userid)}';`
    );
    const itemids: Array<string> = response.rows.map((item) => {return item.itemid})
    
    if (!(itemids.includes(itemID))) {
        return
    }
    await db_adm_conn.query(`
    DELETE
    FROM ShoppingListItem sli
    WHERE sli.itemID = '${checkInputBeforeSqlQuery(itemID)}'`);
};

export const updateShoppingListItem = async (check: boolean, itemid: string) => {
    await db_adm_conn.query(`
    UPDATE ShoppingListItem
    SET done = ${check}
    WHERE itemID = '${checkInputBeforeSqlQuery(itemid)}'`);
};

export const getShoppingListItems = async (listID: string, userid: string) => {
    const response : QueryResult = await db_adm_conn.query(`
    SELECT itemID, productName, barcode, done, quantity
    FROM ShoppingListItem sli
    JOIN ShoppingList sl ON sl.listID = sli.listID
    WHERE sl.listID = '${checkInputBeforeSqlQuery(listID)}'
        AND sl.enduserId = '${checkInputBeforeSqlQuery(userid)}';`);
    return response.rows
};

export const getShoppingLists = async (userid: string) => {
    const response : QueryResult = await db_adm_conn.query(`
    SELECT listName, listID
    FROM ShoppingList
    WHERE enduserId = '${checkInputBeforeSqlQuery(userid)}';`);
    return response.rows
};