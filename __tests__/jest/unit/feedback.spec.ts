import supertest from "supertest"
import {app} from "../../../server_config"
import jwt from "./mocks/mock_jwt"
import db from "./mocks/mock_db"
import translation from "./../../../translation.json"

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
            expect(response.body).toStrictEqual({})
        }
    })
    test('create feedback missing content', async () => {
        const response = await supertest(app).post("/feedback").send({
            reason: "appreciation"
        }).set('authorization', 'Bearer token_existing');
        expect(response.statusCode).toBe(400)
        expect(response.body).toStrictEqual({"Error": "No content provided", "Details": translation[`Content is not provided or empty!`] })
    })
    test('create feedback missing reason', async () => {
        const response = await supertest(app).post("/feedback").send({            
            content: "fooocking awesome!!!",
        }).set('authorization', 'Bearer token_existing');
        expect(response.statusCode).toBe(400)
        expect(response.body).toStrictEqual({"Error": "No reason provided", "Details": translation[`Reason is not provided or empty!`]})
    })
    test('create feedback invalid reason', async () => {
        const response = await supertest(app).post("/feedback").send({            
            reason: "because I like you",
            content: "fooocking awesome!!!",
        }).set('authorization', 'Bearer token_existing');
        expect(response.statusCode).toBe(400)
        expect(response.body).toStrictEqual({"Error": "Reason not valid", "Details": `Given reason 'because I like you' is not part of possible reasons: ${_feedbackReasons}!`})
    })
})