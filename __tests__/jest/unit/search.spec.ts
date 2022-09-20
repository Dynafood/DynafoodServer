import supertest from "supertest"
import {app} from "../../../server_config"
import jwt from "../unit/mocks/mock_jwt"
import db from "./mocks/mock_db"

jwt.init()
db.init()

describe('check search products route', () => {
    test('get search products', async () => {
        const response = await supertest(app).get("/searchProduct")
            .query({
                value: 'coke',
                count: '2',
            }).send().set('authorization', 'Bearer token_existing');
        expect(response.statusCode).toBe(200)
        expect(response.body.length).toEqual(2);
    })
    test('value undefined', async () => {
        const response = await supertest(app).get("/searchProduct")
            .query({
                count: '2',
            }).send().set('authorization', 'Bearer token_existing');
        expect(response.statusCode).toBe(400)
        expect(response.body).toStrictEqual(
            { Error: 'Unable to get product', Details: "'value' is missing." }
        );
    })
    test('count undefined', async () => {
        const response = await supertest(app).get("/searchProduct")
            .query({
                value: 'coke',
            }).send().set('authorization', 'Bearer token_existing');
        expect(response.statusCode).toBe(400)
        expect(response.body).toStrictEqual(
            { Error: 'Unable to get product', Details: "'count' is missing." }
        );
    })
})
