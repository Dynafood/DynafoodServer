import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from "express";
import { UserInterface } from '../../../include/userInterface';
import { dbGetUser } from '../../modules/db/userManagement';

export const secureRouteMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const token: string | null | undefined = req.cookies.token;
    let header_token: string | undefined | null = req.headers['authorization']
    if (typeof token != "undefined" && token != null) {
        try {
            const user: UserInterface = <UserInterface>(jwt.verify(token, <string>process.env.JWT_SECRET));
            res.locals.user = user
            if (dbGetUser(user.userid) != null)
                throw  "user does not exist"
            next();
        } catch(error) {
            res.clearCookie("token");
            res.status(401).send({ "Error": "401 Unauthorized" });
        }
    } else
     if (typeof header_token != "undefined" && header_token != null) {
        try {
            if (header_token.indexOf("Bearer ") != 0)
                throw "no valid bearer"
            header_token = header_token.substring(7)
            const user: UserInterface = <UserInterface>(jwt.verify(header_token, <string>process.env.JWT_SECRET));
            res.locals.user = user;
            if (dbGetUser(user.userid) != null)
                throw  "user does not exist"
            next();
        } catch(error) {
            res.status(401).send({ "Error": "401 Unauthorized" });
        }
    } else {
        res.status(401).send({ "Error": "401 Unauthorized" });
    }
};
