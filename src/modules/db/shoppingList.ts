import { checkInputBeforeSqlQuery } from './scripts';
import { db_adm_conn } from './index';
import { QueryResult, QueryResultRow } from 'pg';

export const createShoppingList = async (name: string, userid: string) => {
    console.log(name, userid)
    await db_adm_conn.query(`
            INSERT INTO ShoppingList (endUserId, listName)
            VALUES ('${checkInputBeforeSqlQuery(userid)}', '${checkInputBeforeSqlQuery(name)}');
        `);
};

//later create units which can be used
export const createShoppingListItem = async (itemName: string, listID: string, barcode: string | null, quantity: number | null) => {
    console.log(barcode, quantity, listID, itemName)
    await db_adm_conn.query(`
            INSERT INTO ShoppingListItem (listID, productName, barcode, quantity, done)
            VALUES ('${checkInputBeforeSqlQuery(listID)}', '${checkInputBeforeSqlQuery(itemName)}', '${checkInputBeforeSqlQuery(barcode)}', '${quantity}', false);
        `);
    
};