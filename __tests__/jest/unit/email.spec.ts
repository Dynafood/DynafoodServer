import supertest from "supertest"
import {app} from "../../../server_config"
import jwt from "../unit/mocks/mock_jwt"
import db from "./mocks/mock_db"
import mail from "./mocks/mock_mail"

jwt.init()
db.init()
mail.init()

describe('check email route', () => {
    test('check route', async () => {
        const response = await supertest(app).get("/invalidDataMail").send();
        expect(response.statusCode).toBe(200)
    })
    // TODO(marcel)
    //test('check invalid product DB insert', async () => {
        //const response = await supertest(app).post("/invalidproductDBInsert/").send({ userid: "existing", barcode: "", productname: "", productDesc: "" }).set('authorization', 'Bearer token_existing');
        //expect(response.statusCode).toBe(200)
    //})
})
