import { db_adm_conn } from './index';
import { QueryResult } from 'pg';
import { checkInputBeforeSqlQuery } from './scripts';
import { Request, Response } from 'express';
import { JsonObject } from 'swagger-ui-express';

export const updateHistory = async (userID: string, barcode: string, product: JsonObject) : Promise<void> => {
    const response : QueryResult = await db_adm_conn.query(`
    SELECT COUNT (historyId)
    FROM History
    WHERE barcode = '${checkInputBeforeSqlQuery(barcode)}'
        AND enduserId = '${checkInputBeforeSqlQuery(userID)}';`);
    if (response.rows[0].count === 1) {
        await updateHistoryElement(userID, barcode, product);
    } else {
        if (response.rows[0].count > 1) {
            await cleanDublicateHistory(userID, barcode);
        }
        await insertIntoHistory(userID, barcode, product);
    }
};

export const cleanDublicateHistory = async (userID: string, barcode: string) : Promise<void> => {
    await db_adm_conn.query(`
    DELETE
    FROM History
    WHERE barcode = '${checkInputBeforeSqlQuery(barcode)}'
        AND enduserId = '${checkInputBeforeSqlQuery(userID)}';`);
};

export const updateHistoryElement = async (userID: string, barcode: string, product: JsonObject) : Promise<void> => {
    product.name = checkInputBeforeSqlQuery(product.name);
    product.images = checkInputBeforeSqlQuery(product.images);
    await db_adm_conn.query(`
    UPDATE History
    SET (lastused, productName, pictureLink)
       = (current_timestamp, '${product.name}', '${product.images}')
    WHERE barcode = '${checkInputBeforeSqlQuery(barcode)}'
        AND enduserId = '${checkInputBeforeSqlQuery(userID)}';`);
};

export const insertIntoHistory = async (userID: string, barcode: string, product: JsonObject) : Promise<void> => {
    userID = checkInputBeforeSqlQuery(userID);
    barcode = checkInputBeforeSqlQuery(barcode);
    product.name = checkInputBeforeSqlQuery(product.name);
    product.images = checkInputBeforeSqlQuery(product.images);

    await db_adm_conn.query(`
    INSERT INTO history (endUserID, barcode, productName, pictureLink)
    VALUES ('${userID}', '${barcode}', '${product.name}', '${product.images}');`);
};

export const deleteElementFromHistory = async (req: Request, res: Response) : Promise<void> => {
    const elementID: string = checkInputBeforeSqlQuery(req.params.elementID);
    await db_adm_conn.query(`
    DELETE FROM history
    WHERE historyID = '${elementID}' AND enduserid = '${checkInputBeforeSqlQuery(res.locals.user.userid)}';`);
    res.send('DELETED');
};

export const getElementsFromHistory = async (req: Request, res: Response) : Promise<void> => {
    const userID: string = checkInputBeforeSqlQuery(res.locals.user.userid);
    const response : QueryResult = await db_adm_conn.query(`
    SELECT H.historyID, H.barcode, H.productName, H.lastUsed, H.pictureLink
    FROM History H
    JOIN EndUser EU ON EU.endUserID = H.endUserID
    WHERE EU.endUserID = '${userID}'
    ORDER BY H.lastused DESC;`);
    res.send({ elements: response.rows });
};
