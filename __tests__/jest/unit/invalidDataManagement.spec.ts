import supertest from "supertest"
import {app} from "../../../server_config"
import jwt from "../unit/mocks/mock_jwt"
import db from "./mocks/mock_db"
import mail from "./mocks/mock_mail"

jwt.init()
db.init()
mail.init()

describe('check invalid data routes', () => {
    test('check invalidProductDB route', async () => {
        const response = await supertest(app).get("/invalidproductDB").send().set('authorization', 'Bearer token_existing');
        expect(response.statusCode).toBe(200);
        expect(response.body).toStrictEqual({ "elements": [] });
    })
    test('check invalidproductDBDel route', async () => {
        const response = await supertest(app).delete("/invalidproductDBDel/1").send().set('authorization', 'Bearer token_existing');
        expect(response.statusCode).toBe(200);
        expect(response.body).toStrictEqual({ "status": "DELETED" });
    })
    test('check InsertElementsInvalidData route', async () => {
        const response = await supertest(app).post("/invalidproductDBInsert").send({
            "barcode": "123",
            "productName": "testName",
            "productDesc": "test desc",
        }).set('authorization', 'Bearer token_existing');
        expect(response.statusCode).toBe(200);
        expect(response.body).toStrictEqual({ "status": "add in DB" });
    })
    test('check invalidDataMail route', async () => {
        const response = await supertest(app).get("/invalidDataMail").send();
        expect(response.statusCode).toBe(200);
        expect(response.body).toStrictEqual({ "response": "Email Sent" });
    })
})
