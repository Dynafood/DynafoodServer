import supertest from "supertest"
import {app} from "../../../server_config"
import jwt from "../unit/mocks/mock_jwt"
import db from "./mocks/mock_db"

jwt.init()
db.init()

describe('check get product routes catch', () => {
    test('get non existing product but no catch', async () => {
        const response = await supertest(app).get("/products/barcode/123").send().set('authorization', 'Bearer token_existing');
        expect(response.statusCode).toBe(204)
    })
    test('existing product nutella catch', async () => {
        const response = await supertest(app).get("/products/barcode/3017620425035").send().set('authorization', 'Bearer token_existing');
        expect(response.statusCode).toBe(500)
    })
})
