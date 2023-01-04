import { checkInputBeforeSqlQuery } from './scripts';
import { db_adm_conn } from './index';
import { QueryResult, QueryResultRow } from 'pg';

export const createShoppingList = async (name: string, userid: string) => {
    console.log("create shopping list", name, userid)
    await db_adm_conn.query(`
            INSERT INTO ShoppingList (endUserId, listName)
            VALUES ('${checkInputBeforeSqlQuery(userid)}', '${checkInputBeforeSqlQuery(name)}');
        `);
};

//later create units which can be used
export const createShoppingListItem = async (itemName: string, listID: string, barcode: string | null, quantity: number | null) => {
    console.log("create list item", barcode, quantity, listID, itemName)
    await db_adm_conn.query(`
            INSERT INTO ShoppingListItem (listID, productName, barcode, quantity, done)
            VALUES ('${checkInputBeforeSqlQuery(listID)}', '${checkInputBeforeSqlQuery(itemName)}', '${checkInputBeforeSqlQuery(barcode)}', '${quantity}', false);
        `);
    
};

export const deleteShoppingList = async (listID: string, userid: string) => {
    console.log("delete shopping list", listID, userid)
    await db_adm_conn.query(`
    DELETE
    FROM ShoppingList
    WHERE listID = '${checkInputBeforeSqlQuery(listID)}'
        AND enduserId = '${checkInputBeforeSqlQuery(userid)}';`);
};

export const deleteShoppingListItem = async (itemID: string, userid: string) => {
    console.log("delete shopping list item", itemID, userid)

    const response : QueryResult = await db_adm_conn.query(`
        SELECT itemID
        FROM ShoppingListItem sli
        JOIN ShoppingList sl ON sl.listID = sli.listID
        WHERE sl.enduserId = '${checkInputBeforeSqlQuery(userid)}';`
    );
    const itemids: Array<string> = response.rows.map((item) => {return item.itemid})
    
    if (!(itemids.includes(itemID))) {
        console.log(`unautherized deletion attempt by ${userid} for item ${itemID}`)
        return
    }
    await db_adm_conn.query(`
    DELETE
    FROM ShoppingListItem sli
    WHERE sli.itemID = '${checkInputBeforeSqlQuery(itemID)}'`);
};

export const updateShoppingListItem = async (check: boolean, itemid: string) => {
    console.log("check an item to", check, itemid)
    await db_adm_conn.query(`
    UPDATE ShoppingListItem
    SET done = ${check}
    WHERE itemID = '${checkInputBeforeSqlQuery(itemid)}'`);
};

export const getShoppingListItems = async (listID: string, userid: string) => {
    console.log("get shopping list items", listID, userid)
    const response : QueryResult = await db_adm_conn.query(`
    SELECT itemID, productName, barcode, done, quantity
    FROM ShoppingListItem sli
    JOIN ShoppingList sl ON sl.listID = sli.listID
    WHERE sl.listID = '${checkInputBeforeSqlQuery(listID)}'
        AND sl.enduserId = '${checkInputBeforeSqlQuery(userid)}';`);
    return response.rows
};

export const getShoppingLists = async (userid: string) => {
    console.log("get shopping lists", userid)
    const response : QueryResult = await db_adm_conn.query(`
    SELECT listName, listID
    FROM ShoppingList
    WHERE enduserId = '${checkInputBeforeSqlQuery(userid)}';`);
    return response.rows
};