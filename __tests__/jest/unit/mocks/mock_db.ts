import { init_db } from "../../../../server_config"
import { JsonObject } from "swagger-ui-express";
import { createUser, deleteUser, getUser, setPasswordResetToken } from "./mock_user";
import { createNewFeedback } from "./mock_feedback";
import { updateHistory, getElements, deleteElementFromHistory } from "./mock_history";
import {insert} from "./mock_trendingProduct"
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
        getUser: getUser,
        setPasswordResetToken: setPasswordResetToken,
    },
    ResetPassword: {
        updatePassword: updatePassword
    },
    TrendingProducts: {
        insert: insert
    },
    connect: async () => {},
    end: async () => {}
}

const init = () => {
    init_db(mock_db)
}

export default { init }
