import { QueryResultRow } from "pg";

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
                        alertactivation: true,
                        restrictionname: "peanut"
                    }
                ] )
            }
        if (userid == "throw")
            throw new Error("ErrorMock")
        resolve( [] )
    });
}

export const createUser = async (firstName: string, lastName: string, userName: string, email: string, phoneNumber: string, password: string) : Promise<QueryResultRow> =>  {
    throw new Error("ErrorMock")
}

export const deleteUser = async (userid: string) : Promise<QueryResultRow> => {
    throw new Error("ErrorMock")
}


export const setPasswordResetToken = async (userid: string, token: string) : Promise<QueryResultRow> => {
    throw new Error("ErrorMock")
}

export const getPasswordResetToken = async (userid: string) : Promise<QueryResultRow | undefined> => {
    throw new Error("ErrorMock")
}

export const createUserOAuth = async (userid: string, provider_id: string, userName: string, pictureLink: string, email: string, userProviderId: string) : Promise<QueryResultRow> => {
    throw new Error("ErrorMock")
};