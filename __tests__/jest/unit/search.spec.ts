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
        expect(response.body.length).toEqual(4);
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

describe('check search route for allergens', () => {
    test ('valid milk search de', async () => {
        const response = await supertest(app).get("/searchAllergen")
            .query({
                name: 'milk',
                language: 'de'
            }).send().set('authorization', 'Bearer token_existing');
        expect(response.statusCode).toBe(200)
        expect(response.body).toStrictEqual(["I milk your mom"]);
    });
    test ('valid milk search en', async () => {
        const response = await supertest(app).get("/searchAllergen")
            .query({
                name: 'milk',
                language: 'en'
            }).send().set('authorization', 'Bearer token_existing');
        expect(response.statusCode).toBe(200)
        expect(response.body).toStrictEqual(["I milk your mom"]);
    });
    test ('valid milk search fr', async () => {
        const response = await supertest(app).get("/searchAllergen")
            .query({
                name: 'milk',
                language: 'fr'
            }).send().set('authorization', 'Bearer token_existing');
        expect(response.statusCode).toBe(200)
        expect(response.body).toStrictEqual(["I milk your mom"]);
    });
    test ('invalid milk search no name', async () => {
        const response = await supertest(app).get("/searchAllergen")
            .query({
                language: 'en'
            }).send().set('authorization', 'Bearer token_existing');
        expect(response.statusCode).toBe(200)
        // expect(response.body).toStrictEqual({"Error" : "BadRequest", Details: "Missing allergen name"});
    });
    test ('invalid milk search no language', async () => {
        const response = await supertest(app).get("/searchAllergen")
            .query({
                name: 'milk',
            }).send().set('authorization', 'Bearer token_existing');
        expect(response.statusCode).toBe(400)
        expect(response.body).toStrictEqual({"Error" : "BadRequest", Details: "Missing language"});
    });
    test ('invalid milk search empty name', async () => {
        const response = await supertest(app).get("/searchAllergen")
            .query({
                language: 'fr',
                name: ''
            }).send().set('authorization', 'Bearer token_existing');
        expect(response.statusCode).toBe(200)
        // expect(response.body).toStrictEqual({"Error" : "BadRequest", Details: "Missing allergen name"});
    });
    test ('invalid milk search empty language', async () => {
        const response = await supertest(app).get("/searchAllergen")
            .query({
                language: '',
                name: 'milk',
            }).send().set('authorization', 'Bearer token_existing');
        expect(response.statusCode).toBe(400)
        expect(response.body).toStrictEqual({"Error" : "BadRequest", Details: "Missing language"});
    });
    test ('invalid milk search wrong language', async () => {
        const response = await supertest(app).get("/searchAllergen")
            .query({
                language: 'f',
                name: 'milk',
            }).send().set('authorization', 'Bearer token_existing');
        expect(response.statusCode).toBe(400)
        expect(response.body).toStrictEqual({"Error" : "BadRequest", Details: "language 'f' no existing"});
    });
    
})
