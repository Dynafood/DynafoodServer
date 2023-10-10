import supertest from "supertest"
import {app} from "../../../server_config"
import jwt from "../unit/mocks/mock_jwt"
import db from "./mocks/mock_db"

jwt.init()
db.init()

describe('check download route', () => {
    test('check download route', async () => {
        const response = await supertest(app).get("/download").send();
        expect(response.statusCode).toBe(200)
    })
    test('check placeholer image route', async () => {
        const response = await supertest(app).get("/placeholderImage").send();
        expect(response.statusCode).toBe(200)
    })
})
