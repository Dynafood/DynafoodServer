import { init_db } from "../../../../server_config"
import { JsonObject } from "swagger-ui-express";
import { createUser, deleteUser, getUser } from "./mock_user";
import { createNewFeedback } from "./mock_feedback";
import { updateHistory, getElements, deleteElementFromHistory } from "./mock_history";
import { createSettings, deleteSettings, getRestrictionIdByName, getSettings, updateSettings, userHasRestriction } from "./mock_settings";
import {updatePassword} from "./mock_password"



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
        updatePassword: updatePassword
    },
    connect: async () => {},
    end: async () => {}
}

const init = () => {
    init_db(mock_db)
}

export default { init }