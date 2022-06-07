import supertest from "supertest"
import {app} from "../../../server_config"
import jwt from "../unit/mocks/mock_jwt"
import db from "./mocks/mock_db"

jwt.init()
db.init()

describe('check change password route', () => {
    test('change password', async () => {
        const response = await supertest(app).get("/resetPassword").send().set('authorization', 'Bearer token_existing');
        expect(response.statusCode).toBe(200)
        // expect(response.body).toStrictEqual({})
    })
})

// describe('check change password route', () => {
//     test('change password', async () => {
//         const response = await supertest(app).get("/resetPassword").send().set('authorization', 'Bearer token_existing');
//         expect(response.statusCode).toBe(200)
//         // expect(response.body).toStrictEqual({})
//     })
// })