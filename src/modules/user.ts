import { QueryResult, QueryResultRow } from 'pg';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { database } from '../../server_config';

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
    restrictons: Array<RestrictionObj>
}

const parseGetUserResponse = (rows: Array<QueryResultRow>) : UserObj => {
    const userObj : UserObj = {
        firstName: rows[0].firstname,
        lastName: rows[0].lastname,
        userName: rows[0].username,
        email: rows[0].email,
        phoneNumber: rows[0].phonenumber,
        restrictons: []
    };
    for (const row of rows) {
        if (!row.restrictionname) { continue; }
        if (row.restrictionname.length !== 0) { userObj.restrictons.push({ alertactivation: row.alertactivation, restrictionName: row.restrictionname }); }
    }
    return userObj;
};

export const createUser = async (req: Request, res: Response) => {
    try {
        const passcode: string = await bcrypt.hash(req.body.password, 10);
        const created: QueryResultRow = await database.User.createUser(req.body.firstName, req.body.lastName, req.body.userName, req.body.email, req.body.phoneNumber, passcode)
        const userid: string = created.enduserid;
        const token: string = jwt.sign({ userid: userid }, <string>process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token, {
            httpOnly: true
        });
        console.log("result: ", res.cookie)
        res.status(200).send(token);
        return;
    } catch (error: any) {
        res.status(400).send({ Error: 'Unable to create new User.', Details: `${error.stack}` });
    }
};


export const getUser = async (req: Request, res: Response) : Promise<void> => {
    try {
        const user : Array<QueryResultRow> = await database.User.getUser(res.locals.user.userid, null)
        if (user.length == 0) {
            res.status(404).send('There is no EndUser with this id.');
            return;
        }
        res.send(parseGetUserResponse(user));
    } catch (err: any) {
        console.log(err.stack);
        res.status(500).send({ Error: err, Details: err.stack });
    }
};

export const deleteUser = async (req: Request, res: Response) : Promise<void> => {
    try {
        const deleted: QueryResultRow = await  database.User.deleteUser(res.locals.user.userid)
        res.send({ Deleted: deleted });
    } catch (err: any) {
        console.log(err.stack);
        res.status(500).send({ Error: err, Details: err.stack });
    }
};



export const getToken = async (req: Request, res: Response) : Promise<void> => {
    const email: string = <string> req.query.email;
    const password: string = <string>req.query.password;

    const user : Array<QueryResultRow> = await database.User.getUser(null, email)

    if (user.length === 0) {
        console.log(`There is no user with the email: ${email}`);
        res.status(404).send({ Error: `There is no user with the email ${email}` });
        return;
    }
    console.log(password, user)
    const correctPassword: boolean = await bcrypt.compare(password, user[0].passcode);
    if (user[0].email === email && correctPassword) {
        const userid : string = user[0].enduserid;
        const token : string = jwt.sign({ userid: userid }, <string>process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token, {
            httpOnly: true
        });
        res.status(200).send(token);
        return;
    }
    res.status(401).send({ Error: 'Wrong credentials' });
};
