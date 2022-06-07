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
        const response = await supertest(app).post("/resetPassword").send({oldPassword: "nop", newPassword: "perfect"}).set('authorization', 'Bearer token_existing');
        expect(response.statusCode).toBe(403)
        expect(response.body).toStrictEqual({Error: "Old password is not matching"})
    })
    test('reset password via verification email too short new password', async () => {
        const response = await supertest(app).post("/resetPassword").send({oldPassword: "password", newPassword: "123"}).set('authorization', 'Bearer token_existing');
        expect(response.statusCode).toBe(409)
        expect(response.body).toStrictEqual({Error: "New password is not strong enough"})
    })
    test('reset password via verification email valid', async () => {
        const response = await supertest(app).post("/resetPassword").send({oldPassword: "password", newPassword: "aA1asbfdoazierf-"}).set('authorization', 'Bearer token_existing');
        expect(response.statusCode).toBe(200)
        expect(response.body).toStrictEqual({status: "OK: updated password"})
    })
})