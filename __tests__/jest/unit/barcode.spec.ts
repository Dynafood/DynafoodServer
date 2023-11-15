import supertest from "supertest"
import {app} from "../../../server_config"
import { calculate_score, Product } from "../../../src/modules/algorithm"
import jwt from "../unit/mocks/mock_jwt"
import db from "./mocks/mock_db"

jwt.init()
db.init()

describe('check get product routes', () => {
    test('existing product nutella non existing language', async () => {
        const response = await supertest(app).get("/products/barcode/3017620422003?language=gr").send().set('authorization', 'Bearer token_existing');
        expect(response.statusCode).toBe(400)
        expect(response.body).toStrictEqual({Error: `The language 'gr' is not supported`})
    })
    test('get non existing product', async () => {
        const response = await supertest(app).get("/products/barcode/123").send().set('authorization', 'Bearer token_existing');
        expect(response.statusCode).toBe(204)
        expect(response.body).toStrictEqual({})
    })
    test('existing product nutella fr', async () => {
        const response = await supertest(app).get("/products/barcode/3017620422003?language=fr").send().set('authorization', 'Bearer token_existing');
        expect(response.statusCode).toBe(200)
        expect(response.body.name).toBe( "Nutella")
        expect(response.body.vegetarian_alert).toBe(false)
    })
    test('test placeholder image', async () => {
        // TODO(MARCEL) look for a product that has no image
        const response = await supertest(app).get("/products/barcode/3700009274323?language=fr").send().set('authorization', 'Bearer token_existing');
        expect(response.statusCode).toBe(200)
        expect(response.body.images).toEqual('http://x2024dynafood545437452001.westeurope.cloudapp.azure.com:8081/placeholderImage');
    })
})
