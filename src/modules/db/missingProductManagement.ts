import {db_adm_conn} from "./index";
import { QueryResult } from "pg";
import { checkInputBeforeSqlQuery } from './scripts';
import { Request, Response, NextFunction } from 'express'
import { JsonObject } from "swagger-ui-express";
import {sendMissingProductEmailBis} from "../../modules/email"
import {uploadImageSub} from "../../modules/db/pictureManagement"


export const updateMissingProduct = async (userID: string, barcode: string, product: string, productImage: string) : Promise<void> => {
    const response : QueryResult = await db_adm_conn.query(`
    SELECT COUNT (missingProductId) 
    FROM MissingProduct
    WHERE barcode = '${checkInputBeforeSqlQuery(barcode)}'
        AND enduserId = '${checkInputBeforeSqlQuery(userID)}';`)
    if (response.rows[0].count == 1) {
        await updateMissingProductElement(userID, barcode, product, productImage)
    } else { 
        if (response.rows[0].count > 1) {
            await cleanDublicateMissingProduct(userID, barcode)
        }
        await insertIntoMissingProduct(userID, barcode, product, productImage)
    }
}

export const cleanDublicateMissingProduct = async (userID: string, barcode: string) : Promise<void> => {
    let response : QueryResult = await db_adm_conn.query(`
    DELETE
    FROM MissingProduct
    WHERE barcode = '${checkInputBeforeSqlQuery(barcode)}'
        AND enduserId = '${checkInputBeforeSqlQuery(userID)}';`)
}

export const updateMissingProductElement = async (userID: string, barcode: string, product: string, productImage : string) : Promise<void> => {
    product = checkInputBeforeSqlQuery(product);
    productImage = checkInputBeforeSqlQuery(productImage);
    let response : QueryResult = await db_adm_conn.query(`
    UPDATE MissingProduct
    SET (productName, picture)
       = (current_timestamp, '${product}', '${productImage}')
    WHERE barcode = '${checkInputBeforeSqlQuery(barcode)}'
        AND enduserId = '${checkInputBeforeSqlQuery(userID)}';`)
}

export const insertIntoMissingProduct = async (userID: string, barcode: string, product: string, productImage: string) : Promise<void> => {

    userID = checkInputBeforeSqlQuery(userID);
    barcode = checkInputBeforeSqlQuery(barcode);
    product = checkInputBeforeSqlQuery(product);
    productImage = await uploadImageSub(productImage);
    console.log(productImage);
    await db_adm_conn.query(`
    INSERT INTO MissingProduct (endUserID, barcode, productName, picture) 
    VALUES ('${userID}', '${barcode}', '${product}', '${productImage}');`)
}

export const deleteElementFromMissingProduct = async (req: Request, res: Response) : Promise<void> => {
    const elementID: string = checkInputBeforeSqlQuery(req.params.elementID);
    await db_adm_conn.query(`
    DELETE FROM MissingProduct 
    WHERE missingProductId = '${elementID}' AND enduserid = '${checkInputBeforeSqlQuery(res.locals.user.userid)}';`)
    res.send("DELETED")
}

export const getElementsFromMissingProduct = async (req: Request, res: Response) : Promise<void> => {
    const userID: string = checkInputBeforeSqlQuery(res.locals.user.userid);
    var response : QueryResult = await db_adm_conn.query(`
    SELECT H.missingProductId, H.barcode, H.productName, H.picture
    FROM MissingProduct H
    JOIN EndUser EU ON EU.endUserID = H.endUserID
    WHERE EU.endUserID = '${userID}'
    ORDER BY H.missingProductId DESC;`)
    res.send( { elements: response.rows })
}


export const InsertElementsInMissingProduct = async (req: Request, res: Response) : Promise<void> => {
    updateMissingProduct(res.locals.user.userid , req.body.barcode , req.body.productname , req.body.productImage)
    sendMissingProductEmailBis(req.body.barcode, req.body.productname)
    res.send("add in DB")

}