import { db_adm_conn } from '../modules/db/index';
import { QueryResult } from 'pg';

import { checkInputBeforeSqlQuery } from './../modules/db/scripts';
import { Request, Response, NextFunction } from 'express';

export const getRestrictionIdByName = async (req: Request, res: Response, next: NextFunction) : Promise<void> => {
    try {
        const restrictionID : QueryResult = await db_adm_conn.query(`
            SELECT restrictionID
            FROM Restriction
            WHERE restrictionName = '${req.body.restrictionName}'
        `);
        if (restrictionID.rowCount === 0) {
            res.status(404).json({ Error: `The restriction ${req.body.restrictionName} is not available on dynafood!` });
            return;
        }
        res.locals.restrictionID = restrictionID.rows[0].restrictionid;
        next();
    } catch (err: any) {
        console.error(err);
        res.status(500).send({ Error: err, Details: err.stack });
    }
};

export const hasRestriction = async (req: Request, res: Response, next: NextFunction) : Promise<void> => {
    try {
        const restriction : QueryResult = await db_adm_conn.query(`
            SELECT * FROM EndUser_Restriction
            WHERE endUserID = '${checkInputBeforeSqlQuery(res.locals.user.userid)}'
            AND restrictionID = '${checkInputBeforeSqlQuery(res.locals.restrictionID)}'
        `);

        if (restriction.rowCount === 0) {
            res.status(400).send({ Error: 'Bad request', Details: `This user does not have a restriction for ${req.body.restrictionName}.` });
            return;
        }
        next();
    } catch (err: any) {
        console.error(err);
        res.status(500).send({ Error: err, Details: err.stack });
    }
};
