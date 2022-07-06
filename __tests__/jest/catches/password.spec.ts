import supertest from "supertest"
import {app, database} from "../../../server_config"
import jwt from "../unit/mocks/mock_jwt"
import db from "./mocks/mock_db"
import mail from "./mocks/mock_mail"

jwt.init()
db.init()
mail.init()

describe('check change password asking route with throw', () => {
    test('ask for email to reset password catch', async () => {
        const response = await supertest(app).get("/resetPassword").send().set('Cookie', ['token=token_existing'])
        expect(response.statusCode).toBe(400)
    })
})

describe('reset password via verification email', () => {
    test('reset password via verification email valid but with throw', async () => {
        const response = await supertest(app).post("/resetPassword").send({password: "aA1asbfdoazierf-"}).set('Cookie', ['token=token_existing'])
        expect(response.statusCode).toBe(500)
    })
})
