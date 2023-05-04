import supertest from "supertest"
import {app} from "../../../server_config"
import jwt from "../unit/mocks/mock_jwt"
import db from "./mocks/mock_db"

jwt.init()
db.init()



describe('check get settings routes', () => {
    test('getSettings with throw Settings', async () => {
        const response = await supertest(app).get("/settings").send().set('Cookie', ['token=token_existing']);
        expect(response.statusCode).toBe(500)
    })
})

describe('check create settings routes', () => {
    test('throw on creating setting', async () => {
        const response = await supertest(app).post("/settings").send({restrictionName: "real", strongness: 2}).set('Cookie', ['token=token_existing']);
        expect(response.statusCode).toBe(500)
    })
})

describe('check update settings routes catch', () => {
    test('throw in restriction id search', async () => {
        const response = await supertest(app).patch("/settings").send({restrictionName: "throw", strongness: 2}).set('Cookie', ['token=token_existing']);
        expect(response.statusCode).toBe(500)
    })
    test('throw in restriction connected to user search', async () => {
        const response = await supertest(app).patch("/settings").send({restrictionName: "throw2", strongness: 2}).set('Cookie', ['token=token_existing']);
        expect(response.statusCode).toBe(500)
    })
    test('throw in updateing settings', async () => {
        const response = await supertest(app).patch("/settings").send({restrictionName: "real", strongness: 2}).set('Cookie', ['token=token_existing']);
        expect(response.statusCode).toBe(500)
    })
})

describe('check delete settings routes', () => {
    test('delete Setting', async () => {
        const response = await supertest(app).delete("/settings").send({restrictionName: "nop"}).set('Cookie', ['token=token_existing']);
        expect(response.statusCode).toBe(500)
    })
})