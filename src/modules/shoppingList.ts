import { Request, Response } from 'express';
import { database } from '../../server_config';

export const createShoppingList = async (req: Request, res: Response) => {
    const name : string = req.body.name;

    if (!name || name.length === 0) {
        res.status(400).send({ Error: 'No name provided', Details: 'Name is not provided or empty!' });
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

export const createShoppingListItem = async (req: Request, res: Response) => {
    const itemName : string = req.body.name;
    const listID : string = req.body.shoppingList;
    const quantity : string | null = req.body.quantity || null;
    const barcode : string | null = req.body.barcode || null;

    if (!itemName || itemName.length === 0) {
        res.status(400).send({ Error: 'No itemName provided', Details: 'itemName is not provided or empty!' });
        return;
    }
    if (!listID || listID.length === 0) {
        res.status(400).send({ Error: 'No listID provided', Details: 'listID is not provided or empty!' });
        return;
    }
    try {
        await database.ShoppingList.createShoppingListItem(itemName ,listID, barcode, quantity);
        res.status(200).send();
    } catch (err: any) {
        console.log(err);
        res.status(500).send({ Error: err, Details: err.stack });
    }
};
