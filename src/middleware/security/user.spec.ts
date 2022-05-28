import { checkPassword } from './user'
import supertest from "supertest"
import {app} from "../../../server"
import { dbGetUserByMail } from '../../modules/db/userManagement'

test('check if password requirements are working', () => {
    expect(checkPassword("1")).toBe("Need a lowerCase")
    expect(checkPassword("a")).toBe("Need a uppercase")
    expect(checkPassword("aA")).toBe("Need a digit")
    expect(checkPassword("aA1")).toBe("Need a special character (@, #, $, %, ^, &, +, -, !, ?, _, *, ., or ,)")
    expect(checkPassword("aA1-")).toBe("Good")
})



describe('check Create user Request', () => {
    let parameters = [
        ["firstName", "karl"],
        ["lastName", "stoer"],
        ["userName", "karl123"],
        ["email", "karl@gmail.com"],
        ["phoneNumber", "00000000"],
        ["password", "pass"]
    ]
        test('wrong signup', async () => { 
            let cur : any = {}
            for (let i = 0; i < parameters.length; i++)  {
                const response = await supertest(app).post("/signup").send(cur);
                expect(response.statusCode).toBe(400)
                expect(response.body.Error.details[0].message).toBe("\"" + parameters[i][0] + "\" is required")
                cur[parameters[i][0]] = parameters[i][1]
            }
            
         })
         test('shot password fail', async () => {
            let cur : any = {}
            for (let i = 0; i < parameters.length; i++)  {
                cur[parameters[i][0]] = parameters[i][1]
            }
            const response = await supertest(app).post("/signup").send(cur);
            expect(response.statusCode).toBe(400)
            expect(response.body.Error.details[0].message).toBe("\"password\" length must be at least 9 characters long")
        })
        test('right signup', async () => {
            let cur : any = {}
            for (let i = 0; i < parameters.length; i++)  {
                cur[parameters[i][0]] = parameters[i][1]
            }
            cur["password"] = "aA1asbfdoazierf-"
            const response = await supertest(app).post("/signup").send(cur);
            expect(response.statusCode).toBe(200)
        })
})

describe('check get user Request', () => {
    	
    
})

// afterAll(async () => {await db_adm_conn.end()})