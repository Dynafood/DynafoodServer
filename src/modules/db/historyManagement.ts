import db_adm_conn from "./index";
import { checkInputBeforeSqlQuery } from './scripts';
import { Request, Response, NextFunction } from 'express'

export const updateHistory = async (userID: string, barcode: string, product: any) => {
    let response = await db_adm_conn.query(`
    SELECT COUNT (historyId) 
    FROM History
    WHERE barcode = '${checkInputBeforeSqlQuery(barcode)}'
        AND enduserId = '${checkInputBeforeSqlQuery(userID)}';`)
    if (response.rows[0].count == 1) {
        await updateHistoryElement(userID, barcode, product)
    } else { 
        if (response.rows[0].count > 1) {
            await cleanDublicateHistory(userID, barcode)
        }
        await insertIntoHistory(userID, barcode, product)
    }
}

export const cleanDublicateHistory = async (userID: string, barcode: string) => {
    let response = await db_adm_conn.query(`
    DELETE
    FROM History
    WHERE barcode = '${checkInputBeforeSqlQuery(barcode)}'
        AND enduserId = '${checkInputBeforeSqlQuery(userID)}';`)
}

export const updateHistoryElement = async (userID: string, barcode: string, product: any) => {
    product.name = checkInputBeforeSqlQuery(product.name);
    product.images = checkInputBeforeSqlQuery(product.images);
    let response = await db_adm_conn.query(`
    UPDATE History
    SET (lastused, productName, pictureLink)
         = (current_timestamp, '${product.name}', '${product.images}')
    WHERE barcode = '${checkInputBeforeSqlQuery(barcode)}'
        AND enduserId = '${checkInputBeforeSqlQuery(userID)}';`)
}

export const insertIntoHistory = async (userID: string, barcode: string, product: any) => {

    userID = checkInputBeforeSqlQuery(userID);
    barcode = checkInputBeforeSqlQuery(barcode);
    product.name = checkInputBeforeSqlQuery(product.name);
    product.images = checkInputBeforeSqlQuery(product.images);

    await db_adm_conn.query(`
    INSERT INTO history (endUserID, barcode, productName, pictureLink) 
    VALUES ('${userID}', '${barcode}', '${product.name}', '${product.images}');`)
}

export const deleteElementFromHistory = async (req: Request, res: Response) => {
    const elementID = checkInputBeforeSqlQuery(req.params.elementID);
    await db_adm_conn.query(`
    DELETE FROM history 
    WHERE historyID = '${elementID}';`)
    res.send("DELETED")
}

export const getElementsFromHistory = async (req: Request, res: Response) => {
    const userID = checkInputBeforeSqlQuery(res.locals.user.userid);
    var response = await db_adm_conn.query(`
    SELECT H.historyID, H.barcode, H.productName, H.lastUsed, H.pictureLink
    FROM History H
    JOIN EndUser EU ON EU.endUserID = H.endUserID
    WHERE EU.endUserID = '${userID}'
    ORDER BY H.lastused DESC;`)
    res.send( { elements: response.rows })
}
