import { checkPassword, checkCreateUserReq } from './user'
import {Request, Response, NextFunction } from "express"
import supertest from "supertest"
import {app} from "../../../server"
test('check if password requirements are working', () => {
    expect(checkPassword("1")).toBe("Need a lowerCase")
    expect(checkPassword("a")).toBe("Need a uppercase")
    expect(checkPassword("aA")).toBe("Need a digit")
    expect(checkPassword("aA1")).toBe("Need a special character (@, #, $, %, ^, &, +, -, !, ?, _, *, ., or ,)")
    expect(checkPassword("aA1-")).toBe("Good")
})

describe('check Create user Request', () => {
    	
        test('no firstname', async () => {
           const response = await supertest(app).post("/signup").send();
           expect(response.statusCode).toBe(400)
           expect(response.body.Error.details[0].message).toBe("\"firstName\" is required")
        })
})

describe('check get user Request', () => {
    	
    test('', async () => {
       const response = await supertest(app).post("/signup").send();
       expect(response.statusCode).toBe(400)
       expect(response.body.Error.details[0].message).toBe("\"firstName\" is required")
    })
})