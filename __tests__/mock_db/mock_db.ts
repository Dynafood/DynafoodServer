import { QueryResultRow } from "pg"
import { DatabaseInterface, init_db } from "../../server_config"
import { jest } from '@jest/globals'
import { JsonObject } from "swagger-ui-express";
import { createUser, deleteUser, getUser } from "./mock_user";
import { createNewFeedback } from "./mock_feedback";




const mock_db: JsonObject = {
    Feedback: {
        createNewFeedback: createNewFeedback
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
        createUser: createUser,
        deleteUser: deleteUser,
        getUser: getUser
    },
    connect: () => {},
    end: () => {}
}

const init = () => {
    init_db(mock_db)
}

export default { init }