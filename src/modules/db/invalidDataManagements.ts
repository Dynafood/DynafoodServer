import {db_adm_conn} from "./index";
import { QueryResult } from "pg";
import { checkInputBeforeSqlQuery } from './scripts';
import { Request, Response, NextFunction } from 'express'
import { JsonObject } from "swagger-ui-express";

import {sendInvalidDataEmailBis} from "../../modules/email"


export const updateInvalidData = async (userID: string, barcode: string, product: string, productDesc: string) : Promise<void> => {
    const response : QueryResult = await db_adm_conn.query(`
    SELECT COUNT (invalidDataId) 
    FROM InvalidData
    WHERE barcode = '${checkInputBeforeSqlQuery(barcode)}'
        AND enduserId = '${checkInputBeforeSqlQuery(userID)}';`)
    if (response.rows[0].count == 1) {
        await updateInvalidDataElement(userID, barcode, product, productDesc)
    } else { 
        if (response.rows[0].count > 1) {
            await cleanDublicateInvalidData(userID, barcode)
        }
        await insertIntoInvalidData(userID, barcode, product, productDesc)
    }
}

export const cleanDublicateInvalidData = async (userID: string, barcode: string) : Promise<void> => {
    let response : QueryResult = await db_adm_conn.query(`
    DELETE
    FROM InvalidData
    WHERE barcode = '${checkInputBeforeSqlQuery(barcode)}'
        AND enduserId = '${checkInputBeforeSqlQuery(userID)}';`)
}

export const updateInvalidDataElement = async (userID: string, barcode: string, product: string, productDesc : string) : Promise<void> => {
    product = checkInputBeforeSqlQuery(product);
    productDesc = checkInputBeforeSqlQuery(productDesc);
    let response : QueryResult = await db_adm_conn.query(`
    UPDATE InvalidData
    SET (productName, productDesc)
       = (current_timestamp, '${product}', '${productDesc}')
    WHERE barcode = '${checkInputBeforeSqlQuery(barcode)}'
        AND enduserId = '${checkInputBeforeSqlQuery(userID)}';`)
}

export const insertIntoInvalidData = async (userID: string, barcode: string, product: string, productDesc : string) : Promise<void> => {

    userID = checkInputBeforeSqlQuery(userID);
    barcode = checkInputBeforeSqlQuery(barcode);
    product = checkInputBeforeSqlQuery(product);

    await db_adm_conn.query(`
    INSERT INTO InvalidData (endUserID, barcode, productName, productDesc) 
    VALUES ('${userID}', '${barcode}', '${product}', '${productDesc}');`)
}

export const deleteElementFromInvalidData = async (req: Request, res: Response) : Promise<void> => {
    const elementID: string = checkInputBeforeSqlQuery(req.params.elementID);
    await db_adm_conn.query(`
    DELETE FROM InvalidData 
    WHERE invalidDataId = '${elementID}' AND enduserid = '${checkInputBeforeSqlQuery(res.locals.user.userid)}';`)
    res.send("DELETED")
}

export const getElementsFromInvalidData = async (req: Request, res: Response) : Promise<void> => {
    const userID: string = checkInputBeforeSqlQuery(res.locals.user.userid);
    var response : QueryResult = await db_adm_conn.query(`
    SELECT H.invalidDataId, H.barcode, H.productName, H.productDesc
    FROM InvalidData H
    JOIN EndUser EU ON EU.endUserID = H.endUserID
    WHERE EU.endUserID = '${userID}'
    ORDER BY H.invalidDataId DESC;`)
    res.send( { elements: response.rows })
}


export const InsertElementsInvalidData = async (req: Request, res: Response) : Promise<void> => {
    updateInvalidData(res.locals.user.userid , req.body.barcode , req.body.productname , req.body.productDesc)
    sendInvalidDataEmailBis(req.body.barcode , req.body.productname , req.body.productDesc)
    res.send("add in DB")
}