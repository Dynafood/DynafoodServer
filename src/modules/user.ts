import { QueryResultRow } from 'pg';
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { database, JWT } from '../../server_config';
import requestIP from 'request-ip';
import geoip from 'geoip-lite';
import { sendVerificationEmail } from '../modules/email';
import CryptoJS from 'crypto-js';

const path = require('path');

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

export type OAuthUserObj = {
    firstName : string,
    lastName : string,
    displayName: string,
    id : string,
    email : string,
    imageLink: string,
    cc: string,
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
        let ip: string = requestIP.getClientIp(req) || "undefined";

        // this is localhost, for testing just put a german address there
        if (ip === "::1" || ip === "::ffff:127.0.0.1") {
            ip = "102.128.165.255";
        }

        const cc: string | undefined = geoip.lookup(ip)?.country;

        if (cc === undefined) {                                                                                                    
            res.status(400).send({ Error: 'Unable to create new User.', Details: `IP lookup failed ${ip}` });                            
            return                                                                                                                 
        }   

        const created: QueryResultRow = await database.User.createUser(req.body.firstName, req.body.lastName, req.body.userName, req.body.email, req.body.phoneNumber, passcode, false, cc);
        const userid: string = created.enduserid;
        const token: string = JWT.create(userid);

        res.cookie('token', token, {
            httpOnly: true
        });
        await sendVerificationEmail("", req.body.email);
        res.status(200).json(token);
        return;
    } catch (error: any) {
        res.status(400).send({ Error: 'Unable to create new User.', Details: `${error.stack}` });
    }
};

export const createUserOAuth = async (userdata: OAuthUserObj): Promise<string> => {
    try {
        // create the user in the normal enduser table
        const created: QueryResultRow = await database.User.createUser(userdata.firstName, userdata.lastName, userdata.displayName, userdata.email, "00", "null", true, userdata.cc);
        const userid: string = created.enduserid;

        const google_provider_id = await database.OAuth.getProviderByName('google');

        const createOAuth: QueryResultRow = await database.User.createUserOAuth(userid, google_provider_id.oauthproviderid, userdata.displayName, userdata.imageLink, userdata.email, "");

        const token: string = JWT.create(userid);
        //res.cookie('token', token, {
            //httpOnly: true
        //});
        //res.status(200).json(token);
        return token;
    } catch (error: any) {
        return error.stack;
        //res.status(400).send({ Error: 'Unable to create new User.', Details: `${error.stack}` });
    }
    return "";
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
        const email: string = (<string> req.query.email).toLowerCase();
        const password: string = <string>req.query.password;

        const user : Array<QueryResultRow> = await database.User.getUser(null, email);

        if (user.length === 0) {
            console.log(`There is no user with the email: ${email}`);
            res.status(404).send({ Error: `There is no user with the email ${email}` });
            return;
        }
        const isEmailConfirmedRow: QueryResultRow = await database.User.getEmailConfirmed(email);

        if (isEmailConfirmedRow === undefined) {
            console.log(`There is no user with email = ${email}`);
            res.status(401).send({ Error: "Unauthenticated", Details: `The user with email = ${email}tried to login without a confired email.`} );
            return;
        }

        const isEmailConfirmed: boolean = isEmailConfirmedRow.emailconfirmed;

        console.log("email confirmed:");
        console.log(isEmailConfirmed);

        if (!isEmailConfirmed) {
            console.log(`The user with email = ${email} tried to login without a confired email.`);
            res.status(401).send({ Error: "Unauthenticated", Details: `The user with email = ${email}tried to login without a confired email.`} );
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

export const verifyEmail = async (req: Request, res: Response) : Promise<void> => {
    const words = CryptoJS.enc.Base64.parse(req.query.email as string);
    const base64email = CryptoJS.enc.Utf8.stringify(words);
    const email = base64email.substring(11, base64email.length - 3);
    await database.User.setEmailConfirmed(email);
    res.status(200).sendFile(`/test.html`, { root: path.join(__dirname, '') });
}














