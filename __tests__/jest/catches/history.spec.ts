import supertest from "supertest"
import {app} from "../../../server_config"
import jwt from "../unit/mocks/mock_jwt"
import db from "./mocks/mock_db"

jwt.init()
db.init()

describe('check get history routes catch', () => {
    test('get history elements catch', async () => {
        const response = await supertest(app).get("/history").send().set('authorization', 'Bearer token_existing');
        expect(response.statusCode).toBe(500)
    })
})

describe('check delete history routes catch', () => {
    test('delete history element catch', async () => {
        const response = await supertest(app).delete("/history/1").send().set('authorization', 'Bearer token_existing');
        expect(response.statusCode).toBe(500)
    })
})