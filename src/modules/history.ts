import {Request, Response } from "express"
import { QueryResultRow } from "pg";
import { database } from "../../server_config";

export const deleteElementFromHistory = async (req: Request, res: Response) : Promise<void> => {
    try {
        const elementID = req.params.elementID || null
        if (elementID == null) {
            res.status(400).send({"Error": "BadRequest", "Details": "elementID missing"})
            return
        }
        await database.History.deleteElementFromHistory(elementID, res.locals.user.userid)
        res.send('DELETED');
    } catch(err: any) {
        res.status(500).send({"Error": err, "Details": err.stack})
    }
};

export const getElementsFromHistory = async (req: Request, res: Response) : Promise<void> => {
    const userID: string = res.locals.user.userid;
    try {
        const response : Array<QueryResultRow> = await database.History.getElements(userID)
        res.send({ elements: response });
    } catch (err: any) {
        res.status(500).send({"Error": err, "Details": err.stack})
    }
};