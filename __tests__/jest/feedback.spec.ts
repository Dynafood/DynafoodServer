import supertest from "supertest"
import {app} from "../../server_config"
import jwt from "../mock_jwt"
import db from "../mock_db/mock_db"

jwt.init()
db.init()


describe('check create feedback routes', () => {
    const _feedbackReasons = [
        "bug",
        "suggestion",
        "appreciation",
        "comment"
   ]
    test('create feedback valid', async () => {
        for (const reason of _feedbackReasons) {
            const response = await supertest(app).post("/feedback").send({
                content: "fooocking awesome!!!",
                reason: reason
            }).set('authorization', 'Bearer token_existing');
            expect(response.statusCode).toBe(200)
        }
    })
    test('create feedback missing content', async () => {
        const response = await supertest(app).post("/feedback").send({
            reason: "appreciation"
        }).set('authorization', 'Bearer token_existing');
        expect(response.statusCode).toBe(400)
        expect(response.body).toMatchObject({"Error": "No content provided", "Details": `Content is not provided or empty!`})
    })
    test('create feedback missing reason', async () => {
        const response = await supertest(app).post("/feedback").send({            
            content: "fooocking awesome!!!",
        }).set('authorization', 'Bearer token_existing');
        expect(response.statusCode).toBe(400)
        expect(response.body).toMatchObject({"Error": "No reason provided", "Details": `Reason is not provided or empty!`})
    })
    test('create feedback invalid reason', async () => {
        const response = await supertest(app).post("/feedback").send({            
            reason: "because I like you",
            content: "fooocking awesome!!!",
        }).set('authorization', 'Bearer token_existing');
        expect(response.statusCode).toBe(400)
        expect(response.body).toMatchObject({"Error": "Reason not valid", "Details": `Given reason 'because I like you' is not part of possible reasons: ${_feedbackReasons}!`})
    })
})