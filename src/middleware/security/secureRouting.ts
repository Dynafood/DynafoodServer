import jwt from 'jsonwebtoken';
import { db_adm_conn } from '../../modules/db/index';
import { QueryResult } from 'pg';

import { checkInputBeforeSqlQuery } from '../../modules/db/scripts';
import { Request, Response, NextFunction } from 'express';
import { UserInterface } from '../../../include/userInterface';

export const checkUserExists = async (user: UserInterface): Promise<boolean> => {
    const response : QueryResult = await db_adm_conn.query(`
    SELECT COUNT(enduserid) FROM enduser WHERE enduserid = '${checkInputBeforeSqlQuery(user.userid)}'`);
    console.log(response);
    if (response.rows[0].count === '1') {
        return true;
    }
    return false;
};

export const secureRouteMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const token: string | null | undefined = req.cookies.token;
    let header_token: string | undefined | null = req.headers.authorization;
    if (typeof token !== 'undefined' && token != null) {
        try {
            const user: UserInterface = <UserInterface>(jwt.verify(token, <string>process.env.JWT_SECRET));
            res.locals.user = user;
            if (!await checkUserExists(user)) {
                throw new Error('user does not exist');
            }
            next();
        } catch (error) {
            // console.log(`Clearing ${token} at request: `, req.path);
            res.clearCookie('token');
            res.status(401).send({ Error: '401 Unauthorized' });
        }
    } else
    if (typeof header_token !== 'undefined' && header_token != null) {
        try {
            if (header_token.indexOf('Bearer ') !== 0) {
                throw new Error('no valid bearer');
            }
            header_token = header_token.substring(7);
            const user: UserInterface = <UserInterface>(jwt.verify(header_token, <string>process.env.JWT_SECRET));
            res.locals.user = user;
            if (!await checkUserExists(user)) {
                throw new Error('user does not exist');
            }
            next();
        } catch (error) {
            res.status(401).send({ Error: '401 Unauthorized' });
        }
    } else {
        res.status(401).send({ Error: '401 Unauthorized' });
    }
};
