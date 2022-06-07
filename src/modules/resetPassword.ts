import bcrypt from 'bcrypt';
import Joi from 'joi';
import { QueryResultRow } from 'pg';
import { Request, Response } from 'express';
import { sendResetPasswordEmail } from './email';
import { database } from '../../server_config';

const schema = Joi.object({
    password: Joi.string()
        .min(8)
        .max(72)
        .required()
});

export const triggerResetPasswordEmail = async (req: Request, res: Response) => {
    try {
        const rows: Array<QueryResultRow> = await database.User.getUser(res.locals.user.userid)

        const email: string = rows[0].email;
        const username: string = rows[0].username;

        await sendResetPasswordEmail(username, email);

        res.status(200).send({ status: 'OK' });
    } catch (err: any) {
        console.log(err.stack);
        res.status(500).send({ Error: err, Details: err.stack });
    }
};

export const resetPassword = async (req: Request, res: Response) => {
    try {
        const oldPassword: string | null = req.body.oldPassword;
        let newPassword: string | null =  req.body.newPassword
        if (oldPassword == null) {
            res.status(400).send({Error: "missing old Password"})
            return
        }
        if (newPassword == null) {
            res.status(400).send({Error: "missing new Password"})
            return
        }
        newPassword = await bcrypt.hash(newPassword, 10);

        const rows: Array<QueryResultRow> = await database.User.getUser(res.locals.user.userid)

        const currentPassword: string = rows[0].passcode;
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

        await database.ResetPassword.updatePassword(res.locals.user.userid, newPassword)

        res.status(200).send({
            status: 'OK: updated password'
        });
    } catch (err: any) {
        console.log(err.stack);
        res.status(500).send({ Error: err, Details: err.stack });
    }
};
