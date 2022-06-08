import supertest from "supertest"
import {app} from "../../../server_config"
import jwt from "../unit/mocks/mock_jwt"
import db from "./mocks/mock_db"
import mail from "./mocks/mock_mail"

jwt.init()
db.init()
mail.init()

describe('check change password asking route', () => {
    test('ask for email to reset password', async () => {
        const response = await supertest(app).get("/resetPassword").send().set('authorization', 'Bearer token_existing');
        expect(response.statusCode).toBe(200)
        expect(response.body).toStrictEqual({status: "OK"})
    })
})

describe('reset password via verification email', () => {
    test('reset password via verification email without old passwords', async () => {
        const response = await supertest(app).post("/resetPassword").send().set('authorization', 'Bearer token_existing');
        expect(response.statusCode).toBe(400)
        expect(response.body).toStrictEqual({Error: "missing old Password"})
    })
    test('reset password via verification email without new passwords', async () => {
        const response = await supertest(app).post("/resetPassword").send({oldPassword: "nice"}).set('authorization', 'Bearer token_existing');
        expect(response.statusCode).toBe(400)
        expect(response.body).toStrictEqual({Error: "missing new Password"})
    })

    test('reset password via verification email wrong old password', async () => {
        const response = await supertest(app).post("/resetPassword").send({oldPassword: "aB!#123", newPassword: "aB!#12323"}).set('authorization', 'Bearer token_existing');
        expect(response.statusCode).toBe(403)
        expect(response.body).toStrictEqual({Error: "Old password is not matching"})
    })
    test('reset password via verification email too short new password (no lowercase)', async () => {
        const response = await supertest(app).post("/resetPassword").send({oldPassword: "aB!#123", newPassword: "123"}).set('authorization', 'Bearer token_existing');
        expect(response.statusCode).toBe(406)
        expect(response.body).toStrictEqual({Error: "Need a lowerCase"})
    })
    test('reset password via verification email too short new password (no uppercase)', async () => {
        const response = await supertest(app).post("/resetPassword").send({oldPassword: "aB!#123", newPassword: "123i"}).set('authorization', 'Bearer token_existing');
        expect(response.statusCode).toBe(406)
        expect(response.body).toStrictEqual({Error: "Need a uppercase"})
    })
    test('reset password via verification email too short new password (no number)', async () => {
        const response = await supertest(app).post("/resetPassword").send({oldPassword: "aB!#123", newPassword: "abBd"}).set('authorization', 'Bearer token_existing');
        expect(response.statusCode).toBe(406)
        expect(response.body).toStrictEqual({Error: "Need a digit"})
    })
    test('reset password via verification email too short new password (no special)', async () => {
        const response = await supertest(app).post("/resetPassword").send({oldPassword: "aB!#123", newPassword: "33abBd"}).set('authorization', 'Bearer token_existing');
        expect(response.statusCode).toBe(406)
        expect(response.body).toStrictEqual({Error: "Need a special character (@, #, $, %, ^, &, +, -, !, ?, _, *, ., or ,)"})
    })
    test('reset password via verification email valid', async () => {
        const response = await supertest(app).post("/resetPassword").send({oldPassword: "password", newPassword: "aA1asbfdoazierf-"}).set('authorization', 'Bearer token_existing');
        expect(response.statusCode).toBe(200)
        expect(response.body).toStrictEqual({status: "OK: updated password"})
    })
})
