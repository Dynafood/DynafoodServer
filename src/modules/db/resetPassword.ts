import { db_adm_conn } from '.';
import { checkInputBeforeSqlQuery } from './scripts';

import bcrypt from 'bcrypt';
import Joi from 'joi';
import { QueryResult } from 'pg';
import { Request, Response } from 'express';
import { sendResetPasswordEmail } from './../email';

const schema = Joi.object({
    password: Joi.string()
        .min(8)
        .max(72)
        .required()
});

export const triggerResetPasswordEmail = async (req: Request, res: Response) => {
    try {
        const user: QueryResult = await db_adm_conn.query(`
            SELECT userName, email, passcode
            FROM endUser
            WHERE endUserID = '${checkInputBeforeSqlQuery(res.locals.user.userid)}'
        `);

        if (user.rows.length === 0) {
            res.status(404).send({ Error: 'There is no EndUser with that id.' });
            return;
        }

        const email: string = user.rows[0].email;
        const username: string = user.rows[0].username;

        sendResetPasswordEmail(username, email);

        res.status(200).send({ status: 'OK' });
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
            res.status(404).send({ Error: 'There is no EndUser with this id.' });
            return;
        }

        const currentPassword: string = user.rows[0].passcode;
        const correctPassword: boolean = await bcrypt.compare(oldPassword, currentPassword);

        if (!correctPassword) {
            res.status(403).send({ Error: 'Old password is not matching' });
            return;
        }

        const { error } = schema.validate({ password: req.body.newPassword });

        if (error !== undefined) {
            res.status(409).send({ Error: 'New password is not strong enough' });
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

export const updatePassword = async (userid: string, newPassword: string) => {
    await db_adm_conn.query(`
            UPDATE endUser
            SET passcode = '${newPassword}'
            WHERE endUserID = '${checkInputBeforeSqlQuery(userid)}';
        `);
};
