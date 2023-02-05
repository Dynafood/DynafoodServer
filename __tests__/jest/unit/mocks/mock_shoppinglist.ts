import { QueryResultRow } from "pg"
export const createShoppingList = async (name: string, userid: string) : Promise<void>=> {};
export const createShoppingListItem = async (itemName: string, listID: string, barcode: string | null, quantity: number | null) : Promise<void> => {};
export const deleteShoppingList = async (listid: string, userid: string) : Promise<void> => {};
export const deleteShoppingListItem = async (itemid: string, userid: string) : Promise<void> => {};
export const updateShoppingListItem = async (check: boolean, itemid: string) : Promise<void> => {};
export const getShoppingListItems = async (listid: string, userid: string) : Promise<Array<QueryResultRow>> => {return [
    {
        "itemid": "123456",
        "productname": "myFirstProduct",
        "barcode": "987",
        "done": false,
        "quantity": 2
    },
    {
        "itemid": "abcd",
        "productname": "mySecondProduct",
        "barcode": "987",
        "done": true,
        "quantity": 1
    },
]};
export const getShoppingLists = async (userid: string) : Promise<Array<QueryResultRow>> => {return [{
    "listname": "myShoppinglist",
    "listid": "1234"
}]};