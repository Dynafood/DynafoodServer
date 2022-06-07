import { QueryResultRow } from 'pg';

import Joi from 'joi';
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { database } from '../../server_config';

const schema = Joi.object({
    password: Joi.string()
        .min(8)
        .max(72)
        .required()
});

export const sendResetPasswordEmail = async (req: Request, res: Response) => {
    try {
        const user: Array<QueryResultRow> = await database.User.getUser(res.locals.user.userid, null)

        const email: string = user[0].email;
        const passcode: string = user[0].passcode;
        const username: string = user[0].username;

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

        const user: Array<QueryResultRow> = await database.User.getUser(res.locals.user.userid, null)

        if (user.length === 0) {
            res.status(404).send({ Error: 'There is no EndUser with this id.' });
            return;
        }

        const currentPassword: string = user[0].passcode;
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

        database.Password.updatePassword(res.locals.user.userid, newPassword)

        res.status(200).send({
            status: 'OK: updated password'
        });
    } catch (err: any) {
        console.log(err.stack);
        res.status(500).send({ Error: err, Details: err.stack });
    }
};
