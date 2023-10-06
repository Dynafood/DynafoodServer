import supertest from "supertest"
import {app, database} from "../../../server_config"
import jwt from "./mocks/mock_jwt"
import db from "./mocks/mock_db"
import translation from "./../../../translation.json"

jwt.init()
db.init()


describe('check get user routes', () => {
    test('get trendingProductsGlobal valid', async () => {
        const response = await supertest(app)
            .get("/trendingProductsGlobal")
            .query({ count: 10 })
            .send()
            .set('authorization', 'Bearer token_existing');
        expect(response.statusCode).toBe(200)
    })
    test('get trendingProductsGlobal without count', async () => {
        const response = await supertest(app)
            .get("/trendingProductsGlobal")
            .query({})
            .send()
            .set('authorization', 'Bearer token_existing');
        expect(response.statusCode).toBe(400)
        expect(response.body).toStrictEqual({ 
            Error: "Unable to get trending products global", 
            Details: translation["'count' is not defined."]
        });
    })
    test('get trendingProductsGlobal with negativ count', async () => {
        const response = await supertest(app)
            .get("/trendingProductsGlobal")
            .query({ count: -10 })
            .send()
            .set('authorization', 'Bearer token_existing');
        expect(response.statusCode).toBe(400)
        expect(response.body).toStrictEqual({ 
            Error: "Unable to get trending products global", 
            Details: translation["'count' is negative."]
        });
    })
})

describe('check get user routes', () => {
    test('get trendingProductsLocal valid', async () => {
        const response = await supertest(app)
            .get("/trendingProductsLocal")
            .query({ count: 10 })
            .send()
            .set('authorization', 'Bearer token_existing');
        expect(response.statusCode).toBe(200)
    })
    test('get trendingProductsLocal without count', async () => {
        const response = await supertest(app)
            .get("/trendingProductsLocal")
            .query({})
            .send()
            .set('authorization', 'Bearer token_existing');
        expect(response.statusCode).toBe(400)
        expect(response.body).toStrictEqual({ 
            Error: "Unable to get trending products local", 
            Details: translation["'count' is not defined."]
        });
    })
    test('get trendingProductsLocal with negativ count', async () => {
        const response = await supertest(app)
            .get("/trendingProductsLocal")
            .query({ count: -10 })
            .send()
            .set('authorization', 'Bearer token_existing');
        expect(response.statusCode).toBe(400)
        expect(response.body).toStrictEqual({ 
            Error: "Unable to get trending products local", 
            Details: translation["'count' is negative."]
        });
    })
})
