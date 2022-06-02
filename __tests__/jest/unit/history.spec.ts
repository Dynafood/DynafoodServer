import supertest from "supertest"
import {app} from "../../../server_config"
import jwt from "../unit/mocks/mock_jwt"
import db from "./mocks/mock_db"

jwt.init()
db.init()

describe('check get history routes', () => {
    test('get history elements', async () => {
        const response = await supertest(app).get("/history").send().set('authorization', 'Bearer token_existing');
        expect(response.statusCode).toBe(200)
        expect(response.body).toMatchObject({elements: [
            {
                "historyid": "d245f854-0f55-4bb5-b5a9-087b7102a729",
                "barcode": "00000",
                "productname": "Pizza",
                "lastused": "2022-06-02T14:46:02.434Z",
                "picturelink": "https://images.openfoodfacts.org/images/products/00000/front_fr.27.200.jpg"
            },
            {
                "historyid": "e8a34c9b-7992-4f6f-8736-066205d0ab2f",
                "barcode": "42376095",
                "productname": "Mineralwasser still",
                "lastused": "2022-06-02T14:45:55.504Z",
                "picturelink": "https://images.openfoodfacts.org/images/products/42376095/front_en.3.200.jpg"
            }
        ]})
    })
})

describe('check delete history routes', () => {
    test('delete history element', async () => {
        const response = await supertest(app).delete("/history/1").send().set('authorization', 'Bearer token_existing');
        expect(response.statusCode).toBe(200)
    })
})