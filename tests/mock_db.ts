import { QueryResultRow } from "pg"
import { DatabaseInterface, init_db } from "../server_config"
import { jest } from '@jest/globals'
import { JsonObject } from "swagger-ui-express";

export const getUser = async (userid: string | null = null, email: string | null = null) : Promise<Array<QueryResultRow>> => {
    return new Promise((resolve, reject) => {
        if (userid == "existing" || email == "email@gmail.com")
            {
                resolve( [
                    {
                        enduserid: "existing", 
                        passcode: "password", 
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
            resolve( [] )
    });
}

const mock_db: JsonObject = {
    Feedback: {
        createNewFeedback: null
    },
    History: {
        cleanDublicateHistory: null,
        deleteElementFromHistory: null,
        getElements: null,
        insertIntoHistory: null,
        updateHistory: null,
        updateHistoryElement: null
    },
    Password: {
        updatePassword: null
    },
    Settings: {
        createSetting: null,
        deleteAlertSetting: null,
        getAlertSettings: null,
        getRestrictionIdByName: null,
        updateAlertSetting: null,
        userHasRestriction: null
    },
    User: {
        createUser: null,
        deleteUser: null,
        getUser: getUser
    },
    connect: null,
    end: null
}

const init = () => {
    init_db(mock_db)
}

export default { init }