import { Request, Response } from 'express';
import { QueryResultRow } from 'pg';
import { database } from '../../server_config';

export const createShoppingList = async (req: Request, res: Response) => {
    const name : string = req.body.name;

    if (!name || name.length === 0) {
        res.status(400).send({ Error: 'No name provided', Details: 'name is not provided or empty!' });
        return;
    }
    try {
        await database.ShoppingList.createShoppingList(name, res.locals.user.userid);
        res.status(200).send();
    } catch (err: any) {
        console.log(err);
        res.status(500).send({ Error: err, Details: err.stack });
    }
};

export const deleteShoppingList = async (req: Request, res: Response) => {
    const id : string = req.body.listid;

    if (!id || id.length === 0) {
        res.status(400).send({ Error: 'No listId provided', Details: 'listId is not provided or empty!' });
        return;
    }
    try {
        await database.ShoppingList.deleteShoppingList(id, res.locals.user.userid);
        res.status(200).send();
    } catch (err: any) {
        console.log(err);
        res.status(500).send({ Error: err, Details: err.stack });
    }
};

export const updateShoppingList = async (req: Request, res: Response) => {
    const id : string = req.body.listid;
    const name : string = req.body.name;

    if (!id || id.length === 0) {
        res.status(400).send({ Error: 'No listId provided', Details: 'listId is not provided or empty!' });
        return;
    }
    if (!name || name.length === 0) {
        res.status(400).send({ Error: 'No name provided', Details: 'name is not provided or empty!' });
        return;
    }
    try {
        await database.ShoppingList.updateShoppingList(name, id, res.locals.user.userid);
        res.status(200).send();
    } catch (err: any) {
        console.log(err);
        res.status(500).send({ Error: err, Details: err.stack });
    }
}

export const createShoppingListItem = async (req: Request, res: Response) => {
    const itemName : string = req.body.name;
    const listid : string = req.body.shoppingList;
    const quantity : number | null = Number(req.body.quantity) || null;
    const barcode : string | null = req.body.barcode || null;

    if (!itemName || itemName.length === 0) {
        res.status(400).send({ Error: 'No itemName provided', Details: 'itemName is not provided or empty!' });
        return;
    }
    if (!listid || listid.length === 0) {
        res.status(400).send({ Error: 'No listId provided', Details: 'listId is not provided or empty!' });
        return;
    }
    try {
        await database.ShoppingList.createShoppingListItem(itemName ,listid, barcode, quantity);
        res.status(200).send();
    } catch (err: any) {
        console.log(err);
        res.status(500).send({ Error: err, Details: err.stack });
    }
};

export const deleteShoppingListItem = async (req: Request, res: Response) => {
    const id : string = req.body.itemid;

    if (!id || id.length === 0) {
        res.status(400).send({ Error: 'No itemId provided', Details: 'itemId is not provided or empty!' });
        return;
    }
    try {
        await database.ShoppingList.deleteShoppingListItem(id, res.locals.user.userid);
        res.status(200).send();
    } catch (err: any) {
        console.log(err);
        res.status(500).send({ Error: err, Details: err.stack });
    }
};

export const updateShoppingListItem = async (req: Request, res: Response) => {
    const itemName : string | null = req.body.itemname || null;
    const barcode : string | null = req.body.barcode || null;
    const quantity : number | null = req.body.quantity || null;
    const id : string | null = req.body.itemid || null;
    const check : boolean |null = req.body.check || null;

    if (!id || id.length === 0) {
        res.status(400).send({ Error: 'No itemId provided', Details: 'itemId is not provided or empty!' });
        return;
    }
    try {
        await database.ShoppingList.updateShoppingListItem(itemName, barcode, quantity, check, id);
        res.status(200).send();
    } catch (err: any) {
        console.log(err);
        res.status(500).send({ Error: err, Details: err.stack });
    }
};

export const getShoppingListItems = async (req: Request, res: Response) => {
    const listid : string = <string> req.query.listid;
    if (!listid || listid.length === 0) {
        res.status(400).send({ Error: 'No listId provided', Details: 'listId is not provided or empty!' });
        return;
    }
    try {
        const response : Array<QueryResultRow> = await database.ShoppingList.getShoppingListItems(listid, res.locals.user.userid);
    res.send({ elements: response });    
    } catch (err: any) {
        console.log(err);
        res.status(500).send({ Error: err, Details: err.stack });
    }
};

export const getShoppingLists = async (req: Request, res: Response) => {
    try {
        const response : Array<QueryResultRow> = await database.ShoppingList.getShoppingLists(res.locals.user.userid);
        res.send({ elements: response });    
    } catch (err: any) {
        console.log(err);
        res.status(500).send({ Error: err, Details: err.stack });
    }
};