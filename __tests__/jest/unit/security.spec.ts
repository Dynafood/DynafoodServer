import supertest from "supertest"
import {app} from "../../../server_config"
import jwt from "./mocks/mock_jwt"
import db from "./mocks/mock_db"

jwt.init()
db.init()


describe('secured routes without token', () => {
    test('getExistingUser without token', async () => {
        const response = await supertest(app).get("/user").send();
        expect(response.statusCode).toBe(401)
        expect(response.body).toStrictEqual({Error: "401 Unauthorized"})
    })
    test('getExistingUser without token', async () => {
        const response = await supertest(app).delete("/user").send();
        expect(response.statusCode).toBe(401)
        expect(response.body).toStrictEqual({Error: "401 Unauthorized"})
    })
})

describe('secured routes with wrong token', () => {
    test('cookie token not valid', async () => {
        const response = await supertest(app).get("/user").send().set('Cookie', ['token=Beareblabla']);
        expect(response.statusCode).toBe(401)
        expect(response.body).toStrictEqual({Error: "401 Unauthorized"})
    })
    test('cookie token user not existing', async () => {
        const response = await supertest(app).get("/user").send().set('Cookie', ['token=token_blabla']);
        expect(response.statusCode).toBe(401)
        expect(response.body).toStrictEqual({Error: "401 Unauthorized"})
    })
    test('token not as bearer', async () => {
        const response = await supertest(app).get("/user").send().set('authorization', 'Beareblabla');
        expect(response.statusCode).toBe(401)
        expect(response.body).toStrictEqual({Error: "401 Unauthorized"})
    })
    test('token not in right format', async () => {
        const response = await supertest(app).get("/user").send().set('authorization', 'Bearer blabla');
        expect(response.statusCode).toBe(401)
        expect(response.body).toStrictEqual({Error: "401 Unauthorized"})
    })
    test('user from token not existing', async () => {
        const response = await supertest(app).get("/user").send().set('authorization', 'Bearer token_nono');
        expect(response.statusCode).toBe(401)
        expect(response.body).toStrictEqual({Error: "401 Unauthorized"})
    })
})