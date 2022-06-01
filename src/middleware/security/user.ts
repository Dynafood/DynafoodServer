import { QueryResultRow } from 'pg';

import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import { database } from '../../../server_config';

const schema = Joi.object({
    firstName: Joi.string()
        .pattern(/^[a-zA-Z\s-]/)
        .min(3)
        .max(20)
        .required(),
    lastName: Joi.string()
        .pattern(/^[a-zA-Z\s-]/)
        .min(3)
        .max(20)
        .required(),
    userName: Joi.string()
        .pattern(/^[a-zA-Z0-9]/)
        .min(3)
        .max(20)
        .required(),
    email: Joi.string()
        .email(
            {
                minDomainSegments: 2,
                tlds: {
                    allow: ['com', 'net', 'eu', 'de', 'fr']
                }
            })
        .required(),
    phoneNumber: Joi.string()
        .pattern(/^[0-9\s+]/)
        .min(8)
        .max(20)
        .required(),
    password: Joi.string()
        .min(8)
        .max(72)
        .required()
});

export const checkPassword = (password: string) : string => 
{
    let regexplower = new RegExp('^(?=.*[a-z]).+$')
    let regexpupper = new RegExp('^(?=.*[A-Z]).+$')
    let regexpNumber = new RegExp('^(?=.*[0-9]).+$')
    let regexpCharacter = new RegExp('^(?=.*[-+_!@#$%^&*.,?]).+$')
    if (regexplower.test(password) == false)
        return "Need a lowerCase"
    if (regexpupper.test(password) == false)
        return "Need a uppercase"
    if (regexpNumber.test(password) == false)
        return "Need a digit"
    if (regexpCharacter.test(password) == false)
        return "Need a special character (@, #, $, %, ^, &, +, -, !, ?, _, *, ., or ,)"
    return "Good"
}

export const checkCreateUserReq = async (req: Request, res: Response, next: NextFunction) : Promise<void> => {
    const { error } = schema.validate(req.body);
    if (error !== undefined) {
        res.status(400).send({ Error: error });
        return;
    }
    const passwordCheck: string = checkPassword(req.body.password)
    if (passwordCheck != "Good") {
        res.status(400).send({"Error": passwordCheck})
        return
    }
    let prevCheckEmail : Array<QueryResultRow> = await database.User.getUser(null, req.body.email)
    if (prevCheckEmail.length !== 0) {
        res.status(409).send({ Error: 'email already exists' });
        return;
    }
    next();
};
