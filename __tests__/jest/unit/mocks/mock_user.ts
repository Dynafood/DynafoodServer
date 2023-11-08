import { QueryResultRow } from "pg";

export const getUser = async (userid: string | null = null, email: string | null = null) : Promise<Array<QueryResultRow>> => {
    return new Promise((resolve, reject) => {
        if ((userid && userid.startsWith("existing")) || email == "email@gmail.com")
            {
                resolve( [
                    {
                        enduserid: userid,
                        passcode: "$2b$10$TQ1P6jaOk8YHzLC3JYlciepXBkf45LVQKIL77VfEmJG7B5PVM.JSG",
                        firstname: "test",
                        lastname: "user",
                        username: "testUser123",
                        email: "email@gmail.com",
                        phonenumber: "00000000",
                        alertactivation: true,
                        restrictionname: "peanut",
                        refresh_token: "token_existing",
                    }
                ] )
            }
            resolve( [] )
    });
}

export const createUser = async (firstName: string, lastName: string, userName: string, email: string, phoneNumber: string, password: string) : Promise<QueryResultRow> =>  {
    return Promise.resolve(
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
        })
}

export const deleteUser = async (userid: string) : Promise<QueryResultRow> => {
    return Promise.resolve(
        {
            enduserid: "existing",
            passcode: "$2b$10$TQ1P6jaOk8YHzLC3JYlciepXBkf45LVQKIL77VfEmJG7B5PVM.JSG",
            firstname: "test",
            lastname: "user",
            username: "testUser123",
            email: "email@gmail.com",
            phonenumber: "00000000",
            country_code: "DE"
        })
}

export const setPasswordResetToken = async (userid: string, token: string) : Promise<QueryResultRow> => {
    return Promise.resolve({})
}

export const getPasswordResetToken = async (userid: string) : Promise<QueryResultRow | undefined> => {
    return {}
}

export const createUserOAuth = async (userid: string, provider_id: string, userName: string, pictureLink: string, email: string, userProviderId: string) : Promise<QueryResultRow> => {
    return {}
};

export const setEmailConfirmed = async (email: string) : Promise<QueryResultRow> => {
    return new Promise (() => {});
}

export const getEmailConfirmed = async (email: string) : Promise<QueryResultRow> => {

    return new Promise((resolve, reject)=> {return resolve({emailconfirmed: true})})
}

export const updateRefreshToken = async (refresh_token: string) : Promise<Array<QueryResultRow>> => {
    return Promise.resolve( [
        {
            userid: "none",
            token: "token_existing"
        }
    ] )
}

export const createRefreshToken = async (refresh_token: string) : Promise<Array<QueryResultRow>> => {
    return Promise.resolve( [
        {
            userid: "none",
            token: "token_existing"
        }
    ] )
}