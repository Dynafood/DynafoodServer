import { Request, Response } from 'express';
import { QueryResultRow } from 'pg';
import { database } from '../../server_config';

export const deleteElementFromHistory = async (req: Request, res: Response) : Promise<void> => {
    try {
        const elementID = req.params.elementID;
        await database.History.deleteElementFromHistory(elementID, res.locals.user.userid);
        res.send('DELETED');
    } catch (err: any) {
        res.status(500).send({ Error: err, Details: err.stack });
    }
};

export const getElementsFromHistory = async (req: Request, res: Response) : Promise<void> => {
    const userID: string = res.locals.user.userid;
    try {
        const response : Array<QueryResultRow> = await database.History.getElements(userID);
        response.forEach(el => {
            const tmp = el.lastused
            const localtime = new Date(tmp)
            el.datetime = {
                "date": `${localtime.getDate().toString().padStart(2, '0')}.${(localtime.getMonth() + 1).toString().padStart(2, '0')}.${localtime.getFullYear()}`,
                "time": `${localtime.getHours().toString().padStart(2, '0')}:${localtime.getMinutes().toString().padStart(2, '0')}`
            }
        })
        res.send({ elements: response });
    } catch (err: any) {
        res.status(500).send({ Error: err, Details: err.stack });
    }
};
