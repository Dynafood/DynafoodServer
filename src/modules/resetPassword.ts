import bcrypt from 'bcrypt';
import { QueryResultRow } from 'pg';
import { Request, Response } from 'express';
import { sendResetPasswordEmail } from './email';
import { database } from '../../server_config';
import { checkPassword } from '../middleware/security/user';

export const verifyCode = async (req: Request, res: Response) => {
    try {
        if (typeof req.body.code === 'undefined' || req.body.code === '') {
            res.status(400).send({ Error: 'No code provided', Details: 'No code provided' });
            return;
        }

        const code: string = req.body.code;
        const old_code_row = await database.User.getPasswordResetToken(res.locals.user.userid);

        console.log(old_code_row);

        if (typeof old_code_row === 'undefined'
                || old_code_row === null
                || typeof old_code_row.password_reset_token === 'undefined'
                || old_code_row.password_reset_token === null
                || old_code_row.password_reset_token === '') {
            res.status(409).send({ Error: 'This user has not requested a code recently', Details: 'This user has not requested a code recently' });
            return;
        }

        const old_code = old_code_row.password_reset_token;

        console.log("old_code: ", old_code);

        if (code !== old_code) {
            res.status(403).send({ Error: 'Code is not matching', Details: 'Code is not matching' });
            return;
        }

        await database.User.setPasswordResetToken(res.locals.user.userid, "");
        res.status(200).send({ status: 'OK' });
    } catch (err: any) {
        console.log(err);
        res.status(500).send({ Error: err, Details: err.stack });
    }
};

function makeResetPasswordToken () {
    let result = '';
    const characters = '0123456789';
    const charactersLength = characters.length;
    const length: number = 6;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

export const triggerResetPasswordEmail = async (req: Request, res: Response) => {
    try {
        const rows: Array<QueryResultRow> = await database.User.getUser(res.locals.user.userid);

        const email: string = rows[0].email;
        const username: string = rows[0].username;
        const token = makeResetPasswordToken();

        await sendResetPasswordEmail(username, email, token);
        await database.User.setPasswordResetToken(res.locals.user.userid, token);

        res.status(200).send({ status: 'OK' });
    } catch (err: any) {
        console.log(err.stack);
        res.status(500).send({ Error: err, Details: err.stack });
    }
};

export const resetPassword = async (req: Request, res: Response) => {
    try {
        const oldPassword: string | null = req.body.oldPassword;
        let newPassword: string | null = req.body.newPassword;
        if (oldPassword == null) {
            res.status(400).send({ Error: 'missing old Password' });
            return;
        }
        if (newPassword == null) {
            res.status(400).send({ Error: 'missing new Password' });
            return;
        }

        const passwordState: string = checkPassword(newPassword);

        if (passwordState !== 'Good') {
            res.status(406).send({ Error: passwordState });
            return;
        }

        newPassword = await bcrypt.hash(newPassword, 10);

        const rows: Array<QueryResultRow> = await database.User.getUser(res.locals.user.userid);

        const currentPassword: string = rows[0].passcode;
        const correctPassword: boolean = await bcrypt.compare(oldPassword, currentPassword);

        if (!correctPassword) {
            res.status(403).send({ Error: 'Old password is not matching' });
            return;
        }

        await database.ResetPassword.updatePassword(res.locals.user.userid, newPassword);

        res.status(200).send({
            status: 'OK: updated password'
        });
    } catch (err: any) {
        console.log(err.stack);
        res.status(500).send({ Error: err, Details: err.stack });
    }
};
