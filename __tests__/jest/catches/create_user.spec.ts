import supertest from "supertest"
import {app} from "../../../server_config"
import jwt from "../unit/mocks/mock_jwt"
import db from "./mocks/mock_db_get_user"

jwt.init()
db.init()

describe('check login user route catch', () => {
    test('invalid password', async () => {
        const response = await supertest(app).get("/login").query({
            email: "email@gmail.com",
            password: "wrong password"
        }).send();
        expect(response.statusCode).toBe(500)
    })
    test('non existing email catch', async () => {
        const response = await supertest(app).get("/login").query({
            email: "nop@gmail.com",
            password: "wrong password"
        }).send();
        expect(response.statusCode).toBe(500)
    })
    test('valid login catch', async () => {
        const response = await supertest(app).get("/login").query({
            email: "email@gmail.com",
            password: "password"
        }).send();
        expect(response.statusCode).toBe(500)
    })
})
