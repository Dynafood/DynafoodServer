import { QueryResultRow } from 'pg';
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { database, JWT } from '../../server_config';

import requestIP from 'request-ip';
import geoip from 'geoip-lite';

type RestrictionObj = {
    alertactivation: boolean,
    restrictionName: string
}
type UserObj = {
    firstName : string,
    lastName : string,
    userName : string,
    email : string,
    phoneNumber : string,
    restriction: Array<RestrictionObj>
}

const parseGetUserResponse = (rows: Array<QueryResultRow>) : UserObj => {
    const userObj : UserObj = {
        firstName: rows[0].firstname,
        lastName: rows[0].lastname,
        userName: rows[0].username,
        email: rows[0].email,
        phoneNumber: rows[0].phonenumber,
        restriction: []
    };
    for (const row of rows) {
        if (!row.restrictionname) { continue; }
        if (row.restrictionname.length !== 0) { userObj.restriction.push({ alertactivation: row.alertactivation, restrictionName: row.restrictionname }); }
    }
    return userObj;
};

export const createUser = async (req: Request, res: Response) => {
    try {
        const passcode: string = await bcrypt.hash(req.body.password, 10);
        const ip: string = requestIP.getClientIp(req) || "undefined";
        console.log("IP: ", ip);
        const cc: string | undefined = geoip.lookup(ip)?.country;
        console.log("CC: ", cc);

        if (cc === undefined) {                                                                                                    
            res.status(400).send({ Error: 'Unable to create new User.', Details: "IP lookup failed" });                            
            return                                                                                                                 
        }   

        const created: QueryResultRow = await database.User.createUser(req.body.firstName, req.body.lastName, req.body.userName, req.body.email, req.body.phoneNumber, passcode);
        const userid: string = created.enduserid;
        const token: string = JWT.create(userid);
        res.cookie('token', token, {
            httpOnly: true
        });
        res.status(200).json(token);
        return;
    } catch (error: any) {
        res.status(400).send({ Error: 'Unable to create new User.', Details: `${error.stack}` });
    }
};

export const getUser = async (req: Request, res: Response) : Promise<void> => {
    const user : Array<QueryResultRow> = await database.User.getUser(res.locals.user.userid, null);
    res.send(parseGetUserResponse(user));
};

export const deleteUser = async (req: Request, res: Response) : Promise<void> => {
    try {
        const deleted: QueryResultRow = await database.User.deleteUser(res.locals.user.userid);
        res.send({ Deleted: deleted });
    } catch (err: any) {
        console.log(err.stack);
        res.status(500).send({ Error: err, Details: err.stack });
    }
};

export const getToken = async (req: Request, res: Response) : Promise<void> => {
    try {
        const email: string = <string> req.query.email;
        const password: string = <string>req.query.password;

        const user : Array<QueryResultRow> = await database.User.getUser(null, email);

        if (user.length === 0) {
            console.log(`There is no user with the email: ${email}`);
            res.status(404).send({ Error: `There is no user with the email ${email}` });
            return;
        }
        const correctPassword: boolean = await bcrypt.compare(password, user[0].passcode);
        if (user[0].email === email && correctPassword) {
            const userid : string = user[0].enduserid;
            const token : string = JWT.create(userid);
            res.cookie('token', token, {
                httpOnly: true
            });
            res.status(200).json(token);
            return;
        }
        res.status(401).send({ Error: 'Wrong credentials' });
    } catch (error: any) {
        res.status(500).send({ Error: error, details: error.stack });
    }
};
