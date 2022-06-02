import supertest from "supertest"
import {app} from "../../../server_config"
import jwt from "../unit/mocks/mock_jwt"
import db from "./mocks/mock_db"

jwt.init()
db.init()


describe('check create feedback routes', () => {
    const _feedbackReasons = [
        "bug",
        "suggestion",
        "appreciation",
        "comment"
   ]
    test('create feedback valid catch', async () => {
        for (const reason of _feedbackReasons) {
            const response = await supertest(app).post("/feedback").send({
                content: "fooocking awesome!!!",
                reason: reason
            }).set('authorization', 'Bearer token_existing');
            expect(response.statusCode).toBe(500)
        }
    })
})