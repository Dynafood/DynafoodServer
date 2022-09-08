import supertest from "supertest"
import jwt from "./mocks/mock_jwt"
import db from "./mocks/mock_db"
import mail from "./mocks/mock_mail"
import {app, database} from "../../../server_config"
import { QueryResultRow } from "pg"

jwt.init()
db.init()
mail.init()

//describe('check change password asking route', () => {
    //test('ask for email to reset password', async () => {
        //const response = await supertest(app).get("/resetPassword?email=dummy").send();
        //console.error(response.body);
        //expect(response.statusCode).toBe(200)
        //expect(response.body).toStrictEqual({status: "OK"})
    //})
//})

const getUser = async (userid: string | null = null, email: string | null = null) : Promise<Array<QueryResultRow>> => {
    return new Promise((resolve, reject) => {
        if (userid == "existing" || email == "email@gmail.com")
            {
                resolve( [
                    {
                        enduserid: "existing", 
                        passcode: "$2b$10$TQ1P6jaOk8YHzLC3JYlciepXBkf45LVQKIL77VfEmJG7B5PVM.JSG", 
                        firstname: "test", 
                        lastname: "user", 
                        username: "testUser123",
                        email: "email@gmail.com",
                        phonenumber: "00000000",
                        country_code: "DE",
                        password_reset_token: "123456",
                    }
                ] )
            }
        resolve( [] )
    });
}

const getPasswordResetToken = async (userid: string) => {
    return { password_reset_token: "123456" };
}

const getPasswordResetTokenUndefined = async (userid: string) => {
    return undefined;
}

describe('reset password via verification email', () => {
    test('trigger reset password email', async () => {
        database.User.getUser = getUser
        const response = await supertest(app).get("/resetPassword?email=email@gmail.com").send().set('authorization', 'Bearer token_existing');
        expect(response.statusCode).toBe(200)
    })
    test('verify code 200', async () => {
        database.User.getUser = getUser
        database.User.getPasswordResetToken = getPasswordResetToken
        const response = await supertest(app).post("/verifyCode").send({ code: "123456" }).set('authorization', 'Bearer token_existing');
        expect(response.statusCode).toBe(200)
    })
    test('verify code 400', async () => {
        database.User.getUser = getUser
        database.User.getPasswordResetToken = getPasswordResetToken
        const response = await supertest(app).post("/verifyCode").send({ code: "" }).set('authorization', 'Bearer token_existing');
        expect(response.statusCode).toBe(400)
    })
    test('verify code 409', async () => {
        database.User.getUser = getUser
        database.User.getPasswordResetToken = getPasswordResetTokenUndefined
        const response = await supertest(app).post("/verifyCode").send({ code: "123456" }).set('authorization', 'Bearer token_existing');
        expect(response.statusCode).toBe(409)
    })
    test('verify code 403', async () => {
        database.User.getUser = getUser
        database.User.getPasswordResetToken = getPasswordResetToken
        const response = await supertest(app).post("/verifyCode").send({ code: "12345" }).set('authorization', 'Bearer token_existing');
        expect(response.statusCode).toBe(403)
    })
    test('reset password via verification email without password', async () => {
        const response = await supertest(app).post("/resetPassword").send().set('authorization', 'Bearer token_existing');
        expect(response.statusCode).toBe(400)
        expect(response.body).toStrictEqual({ Error: 'No password provided', Details: 'No password provided' })
    })
    test('reset password via verification email too short new password (no lowercase)', async () => {
        const response = await supertest(app).post("/resetPassword").send({password: "123"}).set('authorization', 'Bearer token_existing');
        expect(response.statusCode).toBe(409)
        expect(response.body).toStrictEqual({Error: "Password is not strong enough", Details: "Need a lowerCase"})
    })
    test('reset password via verification email too short new password (no uppercase)', async () => {
        const response = await supertest(app).post("/resetPassword").send({password: "123i"}).set('authorization', 'Bearer token_existing');
        expect(response.statusCode).toBe(409)
        expect(response.body).toStrictEqual({Error: "Password is not strong enough", Details: "Need a uppercase"})
    })
    test('reset password via verification email too short new password (no number)', async () => {
        const response = await supertest(app).post("/resetPassword").send({password: "abBd"}).set('authorization', 'Bearer token_existing');
        expect(response.statusCode).toBe(409)
        expect(response.body).toStrictEqual({Error: "Password is not strong enough", Details: "Need a digit"})
    })
    test('reset password via verification email too short new password (no special)', async () => {
        const response = await supertest(app).post("/resetPassword").send({password: "33abBd"}).set('authorization', 'Bearer token_existing');
        expect(response.statusCode).toBe(409)
        expect(response.body).toStrictEqual({Error: "Password is not strong enough", Details: "Need a special character (@, #, $, %, ^, &, +, -, !, ?, _, *, ., or ,)"})
    })
    test('reset password via verification email valid', async () => {
        const response = await supertest(app).post("/resetPassword").send({password: "aA1asbfdoazierf-"}).set('authorization', 'Bearer token_existing');
        expect(response.statusCode).toBe(200)
        expect(response.body).toStrictEqual({status: "OK"})
    })
})
