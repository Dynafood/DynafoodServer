import supertest from "supertest"
import {app} from "../../../server_config"
import jwt from "../unit/mocks/mock_jwt"
import db from "./mocks/mock_db"

jwt.init()
db.init()

describe('check create Shopping list routes', () => {
    test('create valid shoppinglist', async () => {
        const response = await supertest(app).post("/shoppingList").send(
            {
                name: "myShoppinglist"
            }
        ).set('authorization', 'Bearer token_existing');
        expect(response.statusCode).toBe(200)
    });
    test('create no name shoppinglist', async () => {
        const response = await supertest(app).post("/shoppingList").send(
            {
                name: ""
            }
        ).set('authorization', 'Bearer token_existing');
        expect(response.statusCode).toBe(400)
        expect(response.body).toStrictEqual({"Error": 'No name provided', "Details": 'name is not provided or empty!'})
    });
    test('create no name shoppinglist 2', async () => {
        const response = await supertest(app).post("/shoppingList").send(
            {}
        ).set('authorization', 'Bearer token_existing');
        expect(response.statusCode).toBe(400)
        expect(response.body).toStrictEqual({"Error": 'No name provided', "Details": 'name is not provided or empty!'})
    });
})

describe('check get Shopping list routes', () => {
    test('get valid shoppinglists', async () => {
        const response = await supertest(app).get("/shoppingList").send().set('authorization', 'Bearer token_existing');
        expect(response.statusCode).toBe(200)
        expect(response.body).toStrictEqual({
            "elements": [
                {
                    "listname": "myShoppinglist",
                    "listid": "1234"
                }
            ]
        })
    });
});

describe('check delete Shopping list routes', () => {
    test('delete valid shoppinglists', async () => {
        const response = await supertest(app).delete("/shoppingList").send({"listid": "1234"}).set('authorization', 'Bearer token_existing');
        expect(response.statusCode).toBe(200);
    });
    test('delete invalid shoppinglists', async () => {
        const response = await supertest(app).delete("/shoppingList").send({"listid": ""}).set('authorization', 'Bearer token_existing');
        expect(response.statusCode).toBe(400);
        expect(response.body).toStrictEqual({ Error: 'No listId provided', Details: 'listId is not provided or empty!' })
    });
    test('delete invalid shoppinglists 2', async () => {
        const response = await supertest(app).delete("/shoppingList").send().set('authorization', 'Bearer token_existing');
        expect(response.statusCode).toBe(400);
        expect(response.body).toStrictEqual({ Error: 'No listId provided', Details: 'listId is not provided or empty!' })
    });
});

describe('check create Shopping list item', () => {
    test('create valid shoppinglists item', async () => {
        const response = await supertest(app).post("/shoppingList/Item").send({
            "name": "newIem",
            "shoppingList" : "1234",
            "quantity": "5",
            "barcode" : "93245867"
        }).set('authorization', 'Bearer token_existing');
        expect(response.statusCode).toBe(200);
    });
    test('create valid shoppinglists item optional', async () => {
        const response = await supertest(app).post("/shoppingList/Item").send({
            "name": "newIem",
            "shoppingList" : "1234",
        }).set('authorization', 'Bearer token_existing');
        expect(response.statusCode).toBe(200);
    });
    test('create invalid shoppinglists item no name', async () => {
        const response = await supertest(app).post("/shoppingList/Item").send({
            "name": "",
            "shoppingList" : "1234",
            "quantity": "5",
            "barcode" : "93245867"
        }).set('authorization', 'Bearer token_existing');
        expect(response.statusCode).toBe(400);
        expect(response.body).toStrictEqual({ Error: 'No itemName provided', Details: 'itemName is not provided or empty!' }) 
    });
    test('create invalid shoppinglists item no name 2', async () => {
        const response = await supertest(app).post("/shoppingList/Item").send({
            "shoppingList" : "1234",
            "quantity": "5",
            "barcode" : "93245867"
        }).set('authorization', 'Bearer token_existing');
        expect(response.statusCode).toBe(400);
        expect(response.body).toStrictEqual({ Error: 'No itemName provided', Details: 'itemName is not provided or empty!' })
        
    });
    test('create invalid shoppinglists item no listid', async () => {
        const response = await supertest(app).post("/shoppingList/Item").send({
            "name": "newIem",
            "shoppingList" : "",
            "quantity": "5",
            "barcode" : "93245867"
        }).set('authorization', 'Bearer token_existing');
        expect(response.statusCode).toBe(400);
        expect(response.body).toStrictEqual({ Error: 'No listId provided', Details: 'listId is not provided or empty!' })
    });
    test('create invalid shoppinglists item no listid 2', async () => {
        const response = await supertest(app).post("/shoppingList/Item").send({
            "name": "newIem",
            "quantity": "5",
            "barcode" : "93245867"
        }).set('authorization', 'Bearer token_existing');
        expect(response.statusCode).toBe(400);
        expect(response.body).toStrictEqual({ Error: 'No listId provided', Details: 'listId is not provided or empty!' })
    });
});

describe('check delete Shopping list item routes', () => {
    test('delete valid shoppinglist item', async () => {
        const response = await supertest(app).delete("/shoppingList/Item").send({"itemid": "1234"}).set('authorization', 'Bearer token_existing');
        expect(response.statusCode).toBe(200);
    });
    test('delete invalid shoppinglist item id missing', async () => {
        const response = await supertest(app).delete("/shoppingList/Item").send({"itemid": ""}).set('authorization', 'Bearer token_existing');
        expect(response.statusCode).toBe(400);
        expect(response.body).toStrictEqual({ Error: 'No itemId provided', Details: 'itemId is not provided or empty!' })
    });
    test('delete invalid shoppinglists item id missing 2', async () => {
        const response = await supertest(app).delete("/shoppingList/Item").send().set('authorization', 'Bearer token_existing');
        expect(response.statusCode).toBe(400);
        expect(response.body).toStrictEqual({ Error: 'No itemId provided', Details: 'itemId is not provided or empty!' })
    });
});

describe('check update Shopping list item routes', () => {
    test('update valid shoppinglist item', async () => {
        const response = await supertest(app).patch("/shoppingList/Item").send({"itemid": "1234"}).set('authorization', 'Bearer token_existing');
        expect(response.statusCode).toBe(200);
    });
    test('update valid shoppinglist item', async () => {
        const response = await supertest(app).patch("/shoppingList/Item").send({"itemid": "1234", "check": true}).set('authorization', 'Bearer token_existing');
        expect(response.statusCode).toBe(200);
    });
    test('update valid shoppinglist item', async () => {
        const response = await supertest(app).patch("/shoppingList/Item").send({"itemid": "1234", "check": true, "itemname" : "ka ching"}).set('authorization', 'Bearer token_existing');
        expect(response.statusCode).toBe(200);
    });
    test('update invalid shoppinglist item id missing', async () => {
        const response = await supertest(app).patch("/shoppingList/Item").send({"itemid": ""}).set('authorization', 'Bearer token_existing');
        expect(response.statusCode).toBe(400);
        expect(response.body).toStrictEqual({ Error: 'No itemId provided', Details: 'itemId is not provided or empty!' })
    });
    test('update invalid shoppinglists item id missing 2', async () => {
        const response = await supertest(app).patch("/shoppingList/Item").send().set('authorization', 'Bearer token_existing');
        expect(response.statusCode).toBe(400);
        expect(response.body).toStrictEqual({ Error: 'No itemId provided', Details: 'itemId is not provided or empty!' })
    });
});
describe('check update Shopping list routes', () => {
    test('update valid shoppinglist', async () => {
        const response = await supertest(app).patch("/shoppingList").send({"listid": "1234", "name": "new name"}).set('authorization', 'Bearer token_existing');
        expect(response.statusCode).toBe(200);
    });
    test('update invalid shoppinglist list id missing', async () => {
        const response = await supertest(app).patch("/shoppingList").send({"listid": ""}).set('authorization', 'Bearer token_existing');
        expect(response.statusCode).toBe(400);
        expect(response.body).toStrictEqual({ Error: 'No listId provided', Details: 'listId is not provided or empty!' })
    });
    test('update invalid shoppinglists list id missing 2', async () => {
        const response = await supertest(app).patch("/shoppingList").send().set('authorization', 'Bearer token_existing');
        expect(response.statusCode).toBe(400);
        expect(response.body).toStrictEqual({ Error: 'No listId provided', Details: 'listId is not provided or empty!' })
    });
    test('update invalid shoppinglist name missing', async () => {
        const response = await supertest(app).patch("/shoppingList").send({"listid": "1234", "name": ""}).set('authorization', 'Bearer token_existing');
        expect(response.statusCode).toBe(400);
        expect(response.body).toStrictEqual({ Error: 'No name provided', Details: 'name is not provided or empty!' })
    });
    test('update invalid shoppinglist name missing 2', async () => {
        const response = await supertest(app).patch("/shoppingList").send({"listid": "1234"}).set('authorization', 'Bearer token_existing');
        expect(response.statusCode).toBe(400);
        expect(response.body).toStrictEqual({ Error: 'No name provided', Details: 'name is not provided or empty!' })
    });
});

describe('check get Shopping list item routes', () => {
    test('get valid shoppinglist item', async () => {
        const response = await supertest(app).get("/shoppingList/Item?listid=1234").send().set('authorization', 'Bearer token_existing');
        expect(response.statusCode).toBe(200);
        expect(response.body).toStrictEqual({
            "elements": [
                {
                    "itemid": "123456",
                    "productname": "myFirstProduct",
                    "barcode": "987",
                    "done": false,
                    "quantity": 2
                },
                {
                    "itemid": "abcd",
                    "productname": "mySecondProduct",
                    "barcode": "987",
                    "done": true,
                    "quantity": 1
                }
            ]
        })
    });
    test('get invalid shoppinglist item no id', async () => {
        const response = await supertest(app).get("/shoppingList/Item?listid=").send().set('authorization', 'Bearer token_existing');
        expect(response.statusCode).toBe(400);
        expect(response.body).toStrictEqual({ Error: 'No listId provided', Details: 'listId is not provided or empty!' });
    });
    test('get invalid shoppinglist item no id 2', async () => {
        const response = await supertest(app).get("/shoppingList/Item").send().set('authorization', 'Bearer token_existing');
        expect(response.statusCode).toBe(400);
        expect(response.body).toStrictEqual({ Error: 'No listId provided', Details: 'listId is not provided or empty!' });
    });
});