import { init_db } from "../../../../server_config"
import { JsonObject } from "swagger-ui-express";
import { createUser, deleteUser, getUser } from "./mock_user";
import { createNewFeedback } from "./mock_feedback";
import { createSettings, deleteSettings, getRestrictionIdByName, getSettings, updateSettings, userHasRestriction } from "./mock_settings";
import { deleteElementFromHistory, getElements, updateHistory } from "./mock_history";




const mock_db: JsonObject = {
    Feedback: {
        createNewFeedback: createNewFeedback
    },
    History: {
        deleteElementFromHistory: deleteElementFromHistory,
        getElements: getElements,
        updateHistory: updateHistory,
    },
    Password: {
        updatePassword: null
    },
    Settings: {
        createSetting: createSettings,
        deleteAlertSetting: deleteSettings,
        getAlertSettings: getSettings,
        getRestrictionIdByName: getRestrictionIdByName,
        updateAlertSetting: updateSettings,
        userHasRestriction: userHasRestriction
    },
    User: {
        createUser: createUser,
        deleteUser: deleteUser,
        getUser: getUser
    },
    ResetPassword: {
        updatePassword: null
    },
    connect: async () => {throw "ErrorMock"},
    end: async () => {throw "ErrorMock"}
}

const init = () => {
    init_db(mock_db)
}

export default { init }