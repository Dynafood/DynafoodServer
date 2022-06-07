import supertest from "supertest"
import {app} from "../../../server_config"
import jwt from "./mocks/mock_jwt"
import db from "./mocks/mock_db"

jwt.init()
db.init()

describe('check get user routes', () => {
    test('getExistingUser with token', async () => {
        const response = await supertest(app).get("/welcome").send();
        expect(response.statusCode).toBe(200)
        expect(response.body).toStrictEqual({message: 'Welcome 🙌'})
    })
});