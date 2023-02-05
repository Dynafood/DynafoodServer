import supertest from "supertest"
import {app} from "../../../server_config"
import jwt from "../unit/mocks/mock_jwt"
import db from "./mocks/mock_db"

jwt.init()
db.init()

describe('check get shoppinglist routes', () => {
    test('get list with throw', async () => {
        const response = await supertest(app).get("/shoppingList").send().set('Cookie', ['token=token_existing']);
        expect(response.statusCode).toBe(500)
    })
})

describe('check post shoppinglist routes', () => {
    test('post list with throw', async () => {
        const response = await supertest(app).post("/shoppingList").send({
            name: "myShoppinglist"
        }).set('Cookie', ['token=token_existing']);
        expect(response.statusCode).toBe(500)
    })
})

describe('check delete shoppinglist routes', () => {
    test('delete list with throw', async () => {
        const response = await supertest(app).delete("/shoppingList").send({"listid": "1234"}).set('Cookie', ['token=token_existing']);
        expect(response.statusCode).toBe(500)
    })
})

describe('check get shoppinglist items routes', () => {
    test('get list items with throw', async () => {
        const response = await supertest(app).get("/shoppingList/Item?listid=1234").send().set('Cookie', ['token=token_existing']);
        expect(response.statusCode).toBe(500)
    })
})

describe('check post shoppinglist items routes', () => {
    test('post list items with throw', async () => {
        const response = await supertest(app).post("/shoppingList/Item").send({
            "name": "newIem",
            "shoppingList" : "1234",
            "quantity": "5",
            "barcode" : "93245867"
        }).set('Cookie', ['token=token_existing']);
        expect(response.statusCode).toBe(500)
    })
})


describe('check delete shoppinglist items routes', () => {
    test('delete list with throw', async () => {
        const response = await supertest(app).delete("/shoppingList/Item").send({"itemid": "1234"}).set('Cookie', ['token=token_existing']);
        expect(response.statusCode).toBe(500)
    })
})

describe('check update shoppinglist items routes', () => {
    test('update list with throw', async () => {
        const response = await supertest(app).patch("/shoppingList/Item").send({"itemid": "1234"}).set('Cookie', ['token=token_existing']);
        expect(response.statusCode).toBe(500)
    })
})