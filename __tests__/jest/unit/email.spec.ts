import supertest from "supertest"
import {app, mail_sender} from "../../../server_config"
import { sendMissingProductEmailBis, sendVerificationEmail } from "../../../src/modules/email"
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
    test('check send verification email', async () => {
        const email = "test@email.com";
        const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
        await sendVerificationEmail("name", email);
        expect(console.log).toHaveBeenCalledWith(`verification email was sent to ${email}`);
        consoleLogSpy.mockRestore();
    })
    test('check send missing product email bis', async () => {
        const email = "test@email.com";
        const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
        await sendMissingProductEmailBis("barcode", "productname");
        expect(console.log).toHaveBeenCalledWith("email was sent to info.dynafood@gmail.com for an missing product");
        consoleLogSpy.mockRestore();
    })
})
