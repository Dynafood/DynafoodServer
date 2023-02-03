import { QueryResultRow } from "pg"
export const createShoppingList = async (name: string, userid: string) : Promise<void>=> {};
export const createShoppingListItem = async (itemName: string, listID: string, barcode: string | null, quantity: number | null) : Promise<void> => {};
export const deleteShoppingList = async (listid: string, userid: string) : Promise<void> => {};
export const deleteShoppingListItem = async (itemid: string, userid: string) : Promise<void> => {};
export const updateShoppingListItem = async (check: boolean, itemid: string) : Promise<void> => {};
export const getShoppingListItems = async (listid: string, userid: string) : Promise<Array<QueryResultRow>> => {return [{}]};
export const getShoppingLists = async (userid: string) : Promise<Array<QueryResultRow>> => {return [{}]};