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
        if (typeof req.body.email === 'undefined' || req.body.email === '') {
            res.status(400).send({ Error: 'No email provided', Details: 'No email provided' });
            return;
        }

        const code: string = req.body.code;
        const email: string = req.body.email;
        const old_code_row = await database.User.getPasswordResetToken(email);

        if (typeof old_code_row === 'undefined'
                || old_code_row === null
                || typeof old_code_row.password_reset_token === 'undefined'
                || old_code_row.password_reset_token === null
                || old_code_row.password_reset_token === '') {
            res.status(409).send({ Error: `The user with the email ${email} has not requested a code recently`, Details: `The user with the email ${email} has not requested a code recently` });
            return;
        }

        const old_code = old_code_row.password_reset_token;

        if (code !== old_code) {
            res.status(403).send({ Error: 'Code is not matching', Details: 'Code is not matching' });
            return;
        }

        await database.User.setPasswordResetToken(email, "");
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
        const email: string = req.query.email as string;

        if (typeof email === 'undefined' || email === '' || email === null) {
            res.status(400).send({ Error: 'No email provided', Details: 'No email provided' });
            return;
        }

        const token = makeResetPasswordToken();
        await sendResetPasswordEmail('', email, token);
        const user = await database.User.getUser(null, email);

        if (user.length === 0) {
            res.status(204).send({ Error: 'No user with this email', Details: 'No user with this email' });
            return;
        }
        if (typeof user[0].enduserid === 'undefined') {
            res.status(204).send({ Error: 'No user with this email', Details: 'No user with this email' });
            return;
        }
        await database.User.setPasswordResetToken(email, token);
        res.status(200).send({ status: 'OK' });
    } catch (err: any) {
        console.log(err.stack);
        res.status(500).send({ Error: err, Details: err.stack });
    }
};

export const resetPassword = async (req: Request, res: Response) => {
    try {
        let newPassword: string | null = req.body.password;

        if (newPassword === null || typeof newPassword === 'undefined') {
            res.status(400).send({ Error: 'No password provided', Details: 'No password provided' });
            return;
        }

        const passwordState: string = checkPassword(newPassword);

        if (passwordState !== 'Good') {
            res.status(409).send({ Error: 'Password is not strong enough', Details: passwordState });
            return;
        }
        newPassword = await bcrypt.hash(newPassword, 10);
        await database.ResetPassword.updatePassword(res.locals.user.userid, newPassword);
        res.status(200).send({ status: 'OK' });
    } catch (err: any) {
        console.log(err.stack);
        res.status(500).send({ Error: err, Details: err.stack });
    }
};

/* this one should be for changing password not resetting it because it needs an 'oldPassword'
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
*/
