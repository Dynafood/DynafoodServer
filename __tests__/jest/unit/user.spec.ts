import supertest from "supertest"
import {app, database} from "../../../server_config"
import jwt from "./mocks/mock_jwt"
import db from "./mocks/mock_db"
import { QueryResultRow } from "pg"

jwt.init()
db.init()

export const getUser = async (userid: string | null = null, email: string | null = null) : Promise<Array<QueryResultRow>> => {
    return new Promise((resolve, reject) => {
        if (userid == "existing" || email == "email@gmail.com")
            {
                resolve( [
                    {
                        enduserid: "existing", 
                        passcode: "$2b$10$TQ1P6jaOk8YHzLC3JYlciepXBkf45LVQKIL77VfEmJG7B5PVM.JSG", 
                        firstname: "test", 
                        lastname: "user", 
                        username: "testUser123",
                        email: "email@gmail.com",
                        phonenumber: "00000000",
                        country_code: "DE",
                        refresh_token: "token_existing"
                    }
                ] )
            }
        resolve( [] )
    });
}

describe('check get user routes', () => {
    test('getExistingUser with token', async () => {
        const response = await supertest(app).get("/user").send().set('authorization', 'Bearer token_existing');
        expect(response.statusCode).toBe(200)
        expect(response.body).toMatchObject({
            firstName: "test",
            lastName: "user",
            userName: "testUser123",
            email: "email@gmail.com",
            phoneNumber: "00000000",
            restriction: [{ alertactivation: true, restrictionName: 'peanut' }],
        } )
    })
    test('getExistingUser with cookie token', async () => {
        const response = await supertest(app).get("/user").send().set('Cookie', ['token=token_existing']);
        expect(response.statusCode).toBe(200)
        expect(response.body).toMatchObject({
            firstName: "test",
            lastName: "user",
            userName: "testUser123",
            email: "email@gmail.com",
            phoneNumber: "00000000",
            restriction: [{ alertactivation: true, restrictionName: 'peanut' }],
        } )
    })
    test('getExistingUser with cookie token without restriction', async () => {
        database.User.getUser = getUser
        const response = await supertest(app).get("/user").send().set('Cookie', ['token=token_existing']);
        expect(response.statusCode).toBe(200)
        expect(response.body).toMatchObject({
            firstName: "test",
            lastName: "user",
            userName: "testUser123",
            email: "email@gmail.com",
            phoneNumber: "00000000",
            restriction: [],
        } )
    })
})

describe('check create user routes', () => {
    const parameters = [
        ["password", "aA1asbfdoazierf-"],
        ["firstName", "karl"],
        ["lastName", "stoer"],
        ["userName", "karl123"],
        ["email", "karl@gmail.com"],
        ["phoneNumber", "00000000"]
    ]
    test('wrong arguments signup', async () => { 
        let cur : any = {}
        cur[parameters[0][0]] = parameters[0][1]
        for (let i = 1; i < parameters.length; i++)  {
            const response = await supertest(app).post("/signup").send(cur);
            expect(response.statusCode).toBe(400)
            expect(response.body).toMatchObject({Error: {details: [{message: "\"" + parameters[i][0] + "\" is required"}]}})
            cur[parameters[i][0]] = parameters[i][1]
        }
        
     })
     test('wrong password fail', async () => {
        let cur : any = {}
        for (let i = 0; i < parameters.length; i++)  {
            cur[parameters[i][0]] = parameters[i][1]
        }
        const passwords = [
            ["UUUUUUUU", "Need a lowerCase"],
            ["llllllll", "Need a uppercase"],
            ["UUUUllll", "Need a digit"],
            ["UUUUllll1234", "Need a special character (@, #, $, %, ^, &, +, -, !, ?, _, *, ., or ,)"]
        ]
        for (const password of passwords) {
            cur["password"] = password[0]
            const response = await supertest(app).post("/signup").send(cur);
            expect(response.statusCode).toBe(400)
            expect(response.body).toMatchObject({Error: password[1]})
        }
    })
    test('signup existing email', async () => {
        let cur : any = {}
        for (let i = 0; i < parameters.length; i++)  {
            cur[parameters[i][0]] = parameters[i][1]
        }
        cur["email"] = "email@gmail.com"
        const response = await supertest(app).post("/signup").send(cur);
        expect(response.statusCode).toBe(409)
        expect(response.body).toMatchObject({ Error: 'email already exists' })
    })
    test('right signup', async () => {
        let cur : any = {}
        for (let i = 0; i < parameters.length; i++)  {
            cur[parameters[i][0]] = parameters[i][1]
        }
        const response = await supertest(app).post("/signup").send(cur);
        expect(response.body.token).toBe("token_existing");
        expect(response.body.refresh_token).toBe("token_existing");
        expect(response.statusCode).toBe(200)
    })
})

describe('check delete user route', () => {
    test('delete user', async () => {
        const response = await supertest(app).delete("/user").send().set('Cookie', ['token=token_existing']);
        expect(response.statusCode).toBe(200)
        expect(response.body).toMatchObject({Deleted: {
            enduserid: "existing", 
            passcode: "$2b$10$TQ1P6jaOk8YHzLC3JYlciepXBkf45LVQKIL77VfEmJG7B5PVM.JSG", 
            firstname: "test", 
            lastname: "user", 
            username: "testUser123",
            email: "email@gmail.com",
            phonenumber: "00000000"
    } } )
    })
})

describe('check login user route', () => {
    test('invalid password', async () => {
        const response = await supertest(app).get("/login").query({
            email: "email@gmail.com",
            password: "wrong password"
        }).send();
        // expect(response.statusCode).toBe(401)
        expect(response.body).toMatchObject({ Error: 'Wrong credentials' })
    })
    test('non existing email', async () => {
        const response = await supertest(app).get("/login").query({
            email: "nop@gmail.com",
            password: "wrong password"
        }).send();
        expect(response.statusCode).toBe(404)
        expect(response.body).toMatchObject({ Error: "There is no user with the email nop@gmail.com" })
    })
    test('valid login', async () => {
        const response = await supertest(app).get("/login").query({
            email: "email@gmail.com",
            password: "password"
        }).send();
        expect(response.statusCode).toBe(200)
        expect(response.body.token).toBe("token_existing");
        expect(response.body.refresh_token).toBe("token_existing");
    })
})

describe('check refresh route', () => {
    test('invalid refersh_token', async () => {
        const response = await supertest(app).get("/refresh").query({
            refresh_token: "123",
        }).send();
        expect(response.statusCode).toBe(400)
        expect(response.body).toMatchObject({ Error: "Bad Request", Details: `Request token is no UUID.`})
    })
    test('no refersh_token', async () => {
        const response = await supertest(app).get("/refresh").query({
        }).send();
        expect(response.statusCode).toBe(400)
        expect(response.body).toMatchObject({ Error: "Bad Request", Details: `No request_token provided.`})
    })
    test('valid refersh_token', async () => {
        const response = await supertest(app).get("/refresh").query({
            refresh_token: "7e39b530-b868-40f5-91f8-77d1bbe7f218",
        }).send();
        expect(response.statusCode).toBe(200)
    })
})