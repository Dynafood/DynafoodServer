import { Request, Response } from 'express';
import { db_adm_conn } from './index';
import { QueryResult } from 'pg';
import { checkInputBeforeSqlQuery } from './scripts';
import bcrypt from 'bcrypt';

export const sendResetPasswordEmail = async (req: Request, res: Response) => {
    try {
        const user: QueryResult = await db_adm_conn.query(`
            SELECT userName, email, passcode
            FROM endUser
            WHERE endUserID = '${checkInputBeforeSqlQuery(res.locals.user.userid)}'
        `);

        if (user.rows.length === 0) {
            res.status(404).send('There is no EndUser with that id.');
            return;
        }

        const email: string = user.rows[0].email;
        const passcode: string = user.rows[0].passcode;
        const username: string = user.rows[0].username;

        res.status(200).send({
            status: `OK: TODO implement the sending email part. Those are the following parameters. Email: ${email}, Username: ${username}, Password: ${passcode}`
        });
    } catch (err: any) {
        console.log(err.stack);
        res.status(500).send({ Error: err, Details: err.stack });
    }
};

export const resetPassword = async (req: Request, res: Response) => {
    try {
        const oldPassword: string = req.body.oldPassword;
        const newPassword: string = await bcrypt.hash(req.body.newPassword, 10);

        const user: QueryResult = await db_adm_conn.query(`
            SELECT passcode
            FROM endUser
            WHERE endUserID = '${checkInputBeforeSqlQuery(res.locals.user.userid)}'
        `);

        if (user.rows.length === 0) {
            res.status(404).send('There is no EndUser with this id.');
            return;
        }

        const currentPassword: string = user.rows[0].passcode;
        const correctPassword: boolean = await bcrypt.compare(oldPassword, currentPassword);

        if (!correctPassword) {
            res.status(301).send({ Error: 'Old password is not matching' });
            return;
        }

        await db_adm_conn.query(`
            UPDATE endUser
            SET passcode = '${newPassword}'
            WHERE endUserID = '${checkInputBeforeSqlQuery(res.locals.user.userid)}';
        `);

        res.status(200).send({
            status: 'OK: updated password'
        });
    } catch (err: any) {
        console.log(err.stack);
        res.status(500).send({ Error: err, Details: err.stack });
    }
};
