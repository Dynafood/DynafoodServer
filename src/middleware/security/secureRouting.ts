import { QueryResultRow } from 'pg';

import { Request, Response, NextFunction } from 'express';
import { UserInterface } from '../../../include/userInterface';
import { database, JWT } from '../../../server_config';

export const checkUserExists = async (user: UserInterface): Promise<boolean> => {
    const userFound: Array<QueryResultRow> = await database.User.getUser(user.userid, null);
    if (userFound.length > 0) {
        return true;
    }
    return false;
};

export const secureRouteMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const token: string | null | undefined = req.cookies.token;
    let header_token: string | undefined | null = req.headers.authorization;
    if (typeof token !== 'undefined' && token != null) {
        try {
            const user: UserInterface = JWT.validate(token);
            res.locals.user = user;
            if (!await checkUserExists(user)) {
                throw new Error('user does not exist');
            }
            next();
        } catch (error) {
            console.log(`Clearing ${token} at request: `, req.path);
            res.clearCookie('token');
            res.status(401).send({ Error: '401 Unauthorized' });
        }
    } else
    if (typeof header_token !== 'undefined' && header_token != null) {
        try {
            if (!header_token.startsWith('Bearer ')) {
                throw new Error('no valid bearer');
            }
            header_token = header_token.substring(7);
            const user: UserInterface = JWT.validate(header_token);
            res.locals.user = user;
            if (!await checkUserExists(user)) {
                throw new Error('user does not exist');
            }
            next();
        } catch (error) {
            console.log(error);
            res.status(401).send({ Error: '401 Unauthorized' });
        }
    } else {
        res.status(401).send({ Error: '401 Unauthorized' });
    }
};
