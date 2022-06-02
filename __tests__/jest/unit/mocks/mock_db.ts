import { init_db } from "../../../../server_config"
import { JsonObject } from "swagger-ui-express";
import { createUser, deleteUser, getUser } from "./mock_user";
import { createNewFeedback } from "./mock_feedback";
import { updateHistory, getElements, deleteElementFromHistory } from "./mock_history";




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
    connect: async () => {},
    end: async () => {}
}

const init = () => {
    init_db(mock_db)
}

export default { init }