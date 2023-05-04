import supertest from "supertest"
import {app} from "../../../server_config"
import jwt from "./mocks/mock_jwt"
import db from "./mocks/mock_db"

jwt.init()
db.init()



describe('check get settings routes', () => {
    test('getSettings without Settings', async () => {
        const response = await supertest(app).get("/settings").send().set('authorization', 'Bearer token_existing_no_settings');
        expect(response.statusCode).toBe(204)
        expect(response.body).toMatchObject({})
    })
    test('getSettings with settings existing', async () => {
        const response = await supertest(app).get("/settings").send().set('authorization', 'Bearer token_existing');
        expect(response.statusCode).toBe(200)
        expect(response.body).toMatchObject([{
            "restrictionname": "peanut",
            "alertactivation": true,
            "strongness": 2
        },
        {
            "restrictionname": "apple",
            "alertactivation": false,
            "strongness": 2
        }])
    })
})

describe('check create settings routes', () => {
    test('createSettings without restrictionname', async () => {
        const response = await supertest(app).post("/settings").send().set('Cookie', ['token=token_existing']);
        expect(response.statusCode).toBe(400)
        expect(response.body).toStrictEqual({"Error": "BadRequest", "Details": "Missing restrictionName"})
    })
    test('createSettings with non existing restrictionname', async () => {
        const response = await supertest(app).post("/settings").send({restrictionName: "fake", strongness: 2}).set('Cookie', ['token=token_existing']);
        expect(response.statusCode).toBe(404)
        expect(response.body).toStrictEqual({"Error": "The restriction fake is not available on dynafood!"})
    })
    test('createSettings with non existing restrictionname', async () => {
        const response = await supertest(app).post("/settings").send({restrictionName: "real", strongness: 2}).set('Cookie', ['token=token_existing']);
        expect(response.statusCode).toBe(200)
    })
})

describe('check update settings routes', () => {
    test('update Settings which user does not have', async () => {
        const response = await supertest(app).patch("/settings").send({restrictionName: "nop", strongness: 2}).set('Cookie', ['token=token_existing']);
        expect(response.statusCode).toBe(400)
        expect(response.body).toStrictEqual({ Error: 'Bad request', Details: `This user does not have a restriction for nop.` })
    })
    test('update Settings with existing restrictionname', async () => {
        const response = await supertest(app).patch("/settings").send({restrictionName: "real", strongness: 2}).set('Cookie', ['token=token_existing']);
        expect(response.body).toStrictEqual({})
        expect(response.statusCode).toBe(200)
    })
})

describe('check delete settings routes', () => {
    test('delete Setting', async () => {
        const response = await supertest(app).delete("/settings").send({restrictionName: "nop"}).set('Cookie', ['token=token_existing']);
        expect(response.statusCode).toBe(200)
    })
})