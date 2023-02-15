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
            INSERT INTO ShoppingListItem (listID, productName, ${barcode != null ? "barcode, " : ""}${quantity != null ? "quantity, " : ""}done)
            VALUES ('${checkInputBeforeSqlQuery(listID)}', 
            '${checkInputBeforeSqlQuery(itemName)}', 
            ${barcode != null ? `'${checkInputBeforeSqlQuery(barcode)}', ` : ""}
            ${quantity != null ? `'${quantity}', `: ""}false);
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

export const updateShoppingListItem = async (itemName: string | null, barcode: string | null, quantity: number | null, check: boolean | null, itemid: string) => {
    const possible = [["done", check], ["productname", itemName], ["barcode", barcode], ["quantity", quantity]]
    let counter = 0;
    possible.forEach(item => {if (item[1] != null) counter++})
    let query = `
    UPDATE ShoppingListItem
    SET ` + (counter > 1 ? "( " : "" ) ;
    for (let p = 0; p < possible.length; p++) {
        if (possible[p][1] != null) {
            if (p != 0) {
                query += ", " 
            }
            query += `${possible[p][0]}`
        }
    }
    query += counter > 1 ? ") = (" : " = "
    for (let p = 0; p < possible.length; p++) {
        if (possible[p][1] != null) {
            if (p != 0) {
                query += ", " 
            }
            query += `'${possible[p][1]}'`
        }
    }
    query += (counter > 1 ? ") " : "" ) + `
    WHERE itemID = '${checkInputBeforeSqlQuery(itemid)}'`
    console.log(query)
    await db_adm_conn.query(query);
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

export const updateShoppingList = async (userid: string, listid: string, name: string) => {
    const response : QueryResult = await db_adm_conn.query(`
    UPDATE ShoppingList
    SET listname = ${name}
    WHERE listID = '${checkInputBeforeSqlQuery(listid)}'
        AND enduserId = '${checkInputBeforeSqlQuery(userid)}';`);
}