import {db_adm_conn} from "./index";
import { QueryResult } from "pg";
import { checkInputBeforeSqlQuery } from './scripts';
import { Request, Response, NextFunction } from 'express'
import { JsonObject } from "swagger-ui-express";

export const getHalal = async (req: Request, res: Response) : Promise<void> => {
    const userID: string = checkInputBeforeSqlQuery(res.locals.user.userid);
    var response : QueryResult = await db_adm_conn.query(`
    SELECT H.halal
    FROM EndUser H
    WHERE H.endUserID = '${userID}';`)
    console.log(response.rows[0].halal)
    res.send( { elements: response.rows })
}

export const updateHalal = async (req: Request, res: Response) : Promise<void> => {
    const userID: string = checkInputBeforeSqlQuery(res.locals.user.userid);
    const resultHalal: boolean = await getHalalDb(userID)
    console.log(resultHalal)
    if (resultHalal == null || resultHalal == false) {
        var response : QueryResult = await db_adm_conn.query(`
        UPDATE EndUser
        SET halal = true
        WHERE endUserID = '${checkInputBeforeSqlQuery(userID)}';`)
        res.send("Halal set as True")
    }
    else{
        var response : QueryResult = await db_adm_conn.query(`
        UPDATE EndUser
        SET halal = false
        WHERE endUserID = '${checkInputBeforeSqlQuery(userID)}';`)
        res.send("Halal set as False")
    }

}

export const getHalalDb = async (userId : string): Promise<boolean> => {
    var response : QueryResult = await db_adm_conn.query(`
    SELECT H.halal
    FROM EndUser H
    WHERE H.endUserID = '${userId}';`)
    return response.rows[0].halal
}