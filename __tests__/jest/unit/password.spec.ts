import supertest from "supertest"
import {app} from "../../../server_config"
import jwt from "../unit/mocks/mock_jwt"
import db from "./mocks/mock_db"
import mail from "./mocks/mock_mail"

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

describe('reset password via verification email', () => {
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
