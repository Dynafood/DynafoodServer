import supertest from "supertest"
import {app, database} from "../../../server_config"
import jwt from "../unit/mocks/mock_jwt"
import db from "./mocks/mock_db"
import mail from "./mocks/mock_mail"

jwt.init()
db.init()
mail.init()

describe('search allergen route error throw check', () => {
    test('search for allergen', async () => {
        const response = await supertest(app).get("/searchAllergen").query({name: "milki", language: "en"}).send().set('Cookie', ['token=token_existing'])
        expect(response.statusCode).toBe(500)
    })
})