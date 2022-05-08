import { db_adm_conn } from './index';
import { QueryResult, QueryResultRow } from 'pg';
import { checkInputBeforeSqlQuery } from './scripts';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
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

export const getUser = async (req: Request, res: Response) : Promise<void> => {
    try {
        const newUser : QueryResult = await db_adm_conn.query(`
        SELECT EU.firstName, EU.lastName, EU.userName, EU.email, EU.phoneNumber, ER.alertActivation, R.restrictionName
        FROM EndUser EU
        LEFT JOIN EndUser_Restriction ER ON ER.endUserID = EU.endUserID
        LEFT JOIN Restriction R ON R.restrictionID = ER.restrictionID
        WHERE EU.endUserID = '${checkInputBeforeSqlQuery(res.locals.user.userid)}';`);
        if (newUser.rows.length === 0) {
            res.status(404).send('There is no EndUser with this id.');
            return;
        }
        res.send(parseGetUserResponse(newUser.rows));
    } catch (err: any) {
        console.log(err.stack);
        res.status(500).send({ Error: err, Details: err.stack });
    }
};

export const deleteUser = async (req: Request, res: Response) : Promise<void> => {
    try {
        const response : QueryResult = await db_adm_conn.query(`
        DELETE FROM EndUser
        WHERE endUserID = '${checkInputBeforeSqlQuery(res.locals.user.userid)}' RETURNING *;`);
        res.send({ Deleted: response.rows });
    } catch (err: any) {
        console.log(err.stack);
        res.status(500).send({ Error: err, Details: err.stack });
    }
};

export const createUser = async (req: Request, res: Response) => {
    try {
        const passcode: string = await bcrypt.hash(req.body.password, 10);
        const user : QueryResult = await db_adm_conn.query(`
        INSERT INTO EndUser (firstName, lastName, userName, email, phoneNumber, passcode, emailConfirmed)
        VALUES
            (
                '${checkInputBeforeSqlQuery(req.body.firstName)}',
                '${checkInputBeforeSqlQuery(req.body.lastName)}',
                '${checkInputBeforeSqlQuery(req.body.userName)}',
                '${checkInputBeforeSqlQuery(req.body.email)}',
                '${checkInputBeforeSqlQuery(req.body.phoneNumber)}',
                '${checkInputBeforeSqlQuery(passcode)}',
                true
            ) RETURNING *;`);
        const userid: string = user.rows[0].enduserid;
        const token: string = jwt.sign({ userid: userid }, <string>process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token, {
            httpOnly: true
        });
        res.status(200).send(token);
        return;
    } catch (error: any) {
        res.status(400).send({ Error: 'Unable to create new User.', Details: `${error.stack}` });
    }
};

export const getToken = async (req: Request, res: Response) : Promise<void> => {
    const email: string = <string> req.query.email;
    const password: string = <string>req.query.password;

    const user : QueryResult = await db_adm_conn.query(`
        SELECT *
        FROM EndUser
        WHERE email = '${email}';
    `);

    if (user.rows.length === 0) {
        console.log(`There is no user with the email: ${email}`);
        res.status(404).send({ Error: `There is no user with the email ${email}` });
        return;
    }

    if (user.rowCount === 0) {
        res.status(404).send({ Error: 'User has no rows' });
        return;
    }

    const correctPassword: boolean = await bcrypt.compare(password, user.rows[0].passcode);
    if (user.rows[0].email === email && correctPassword) {
        const userid : string = user.rows[0].enduserid;
        const token : string = jwt.sign({ userid: userid }, <string>process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token, {
            httpOnly: true
        });
        res.status(200).send(token);
        return;
    }
    res.status(401).send({ Error: 'Wrong credentials' });
};
