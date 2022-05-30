import supertest from "supertest"
import { checkUserExists } from '../../../../src/middleware/security/secureRouting';
import {app} from "../../../../server_config"
import { UserInterface } from "../../../../include/userInterface";
import jwt from "../../../mock_jwt"
import db from "../../../mock_db"
describe('check protected using', () => {
    jwt.init()
    db.init()
    test('getExistingUser with token', async () => {
        const response = await supertest(app).get("/user").send().set('authorization', 'Bearer token_existing');
        expect(response.statusCode).toBe(200)
        expect(response.body).toMatchObject({
            firstName: "test",
            lastName: "user",
            userName: "testUser123",
            email: "email@gmail.com",
            phoneNumber: "00000000",
            restrictons: [{ alertactivation: true, restrictionName: 'peanut' }]
        } )
    })
})