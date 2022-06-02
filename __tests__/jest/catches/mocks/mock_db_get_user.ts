import { QueryResultRow } from "pg"
import { init_db } from "../../../../server_config"
import { JsonObject } from "swagger-ui-express";

export const getUser = async (userid: string | null = null, email: string | null = null) : Promise<Array<QueryResultRow>> => {
    throw new Error("ErrorMock")
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
    connect: async () => {throw "ErrorMock"},
    end: async () => {throw "ErrorMock"}
}

const init = () => {
    init_db(mock_db)
}

export default { init }