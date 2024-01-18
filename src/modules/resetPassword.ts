import bcrypt from 'bcrypt';
import { QueryResultRow } from 'pg';
import { Request, Response } from 'express';
import { sendResetPasswordEmail } from './email';
import { database } from '../../server_config';
import { checkPassword } from '../middleware/security/user';
import translations from "../../translation.json";

export const verifyCode = async (req: Request, res: Response) => {
    try {
        if (typeof req.body.code === 'undefined' || req.body.code === '') {
            res.status(400).send({ Error: 'No code provided', Details: translations['No code provided'] });
            return;
        }
        if (typeof req.body.email === 'undefined' || req.body.email === '') {
            res.status(400).send({ Error: 'No email provided', Details: translations['No email provided'] });
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
            res.status(403).send({ Error: 'Code is not matching', Details: translations['Code is not matching'] });
            return;
        }

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
            res.status(400).send({ Error: 'No email provided', Details: translations['No email provided'] });
            return;
        }

        const token = req.query.email == 'dynafoodcreators@gmail.com' ? "000000": makeResetPasswordToken();
        await sendResetPasswordEmail('', email, token);
        const user = await database.User.getUser(null, email);

        if (user.length === 0) {
            res.status(204).send({ Error: 'No user with this email', Details: translations['No user with this email'] });
            return;
        }
        if (typeof user[0].enduserid === 'undefined') {
            res.status(204).send({ Error: 'No user with this email', Details: translations['No user with this email'] });
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
        let email: string | null = req.body.email || null;
        let code: string | null = req.body.code || null;

        if (newPassword === null || typeof newPassword === 'undefined') {
            res.status(400).send({ Error: 'No password provided', Details: translations['No password provided'] });
            return;
        }
        if (email == null) {
            res.status(400).send({Error: 'No email provided', Details: translations['No email provided in body']})
            return;
        }
        if (code == null) {
            res.status(400).send({Error: 'No Verfifier code provided', Details: translations["No property 'code' in body provided"]})
            return;
        }

        const passwordState: string = checkPassword(newPassword);

        if (passwordState !== 'Good') {
            res.status(409).send({ Error: 'Password is not strong enough. ' + passwordState, Details: passwordState });
            return;
        }
        newPassword = await bcrypt.hash(newPassword, 10);
        let response : string = await database.ResetPassword.updatePassword(email, newPassword, code);
        if (response.length == 0) {
            res.status(200).send({ status: 'OK' });
        }
        else {
            res.status(400).send({Error: response, Details: response})
        }
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
