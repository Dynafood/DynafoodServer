import supertest from "supertest"
import {app} from "../../../server_config"
import jwt from "../unit/mocks/mock_jwt"
import db from "./mocks/mock_db"

jwt.init()
db.init()

describe('check create user routes', () => {
    const parameters = [
        ["firstName", "karl"],
        ["lastName", "stoer"],
        ["userName", "karl123"],
        ["email", "karl@gmail.com"],
        ["phoneNumber", "00000000"],
        ["password", "aA1asbfdoazierf-"]
    ]
    test('right signup catch', async () => {
        let cur : any = {}
        for (const element of parameters)  {
            cur[element[0]] = element[1]
        }
        const response = await supertest(app).post("/signup").send(cur);
        expect(response.statusCode).toBe(400)
        expect(response.body).toMatchObject({Error: 'Unable to create new User.'})
    })
})

describe('check delete user route', () => {
    test('delete user catch', async () => {
        const response = await supertest(app).delete("/user").send().set('Cookie', ['token=token_existing']);
        expect(response.statusCode).toBe(500)
    })
})

