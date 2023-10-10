import { Request, Response } from 'express';
import { QueryResultRow } from 'pg';
import { database } from '../../server_config';
import { checkInputBeforeSqlQuery } from './db/scripts';
import { sendInvalidDataEmailBis } from "./email"

export const InsertElementsInvalidData = async (req: Request, res: Response) : Promise<void> => {
    await database.InvalidDataManagement.updateInvalidData(res.locals.user.userid , req.body.barcode , req.body.productname , req.body.productDesc)
    sendInvalidDataEmailBis(req.body.barcode , req.body.productname , req.body.productDesc)
    res.status(200).send({ status: "add in DB" })
}

export const getElementsFromInvalidData = async (req: Request, res: Response) : Promise<void> => {
    const userID: string = res.locals.user.userid;
    const response : Array<QueryResultRow> = await database.InvalidDataManagement.getElementsFromInvalidData(userID);
    res.status(200).send( { elements: response })
}

export const deleteElementFromInvalidData = async (req: Request, res: Response) : Promise<void> => {
    const elementID: string = req.params.elementID;
    const userID: string = res.locals.user.userid;
    await database.InvalidDataManagement.deleteElementFromInvalidData(elementID, userID);
    res.status(200).send({ status: "DELETED" })
}
