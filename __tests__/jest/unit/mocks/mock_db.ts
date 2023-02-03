import { DatabaseInterface, init_db } from "../../../../server_config"
import { JsonObject } from "swagger-ui-express";
import { createUser, deleteUser, getUser, setPasswordResetToken, createUserOAuth, getPasswordResetToken } from "./mock_user";
import { createNewFeedback } from "./mock_feedback";
import { updateHistory, getElements, deleteElementFromHistory } from "./mock_history";
import { insert, getCountryCode, getTrendingGlobal, getTrendingLocal} from "./mock_trendingProduct"
import { createSettings, deleteSettings, getRestrictionIdByName, getSettings, updateSettings, userHasRestriction } from "./mock_settings";
import {updatePassword} from "./mock_password"
import { QueryResultRow } from "pg";



const mock_db: JsonObject = { //DatabaseInterface
    // ShoppingList: {
    //     createShoppingList: (name: string, userid: string) => Promise<void>
    //     createShoppingListItem: (itemName: string, listID: string, barcode: string | null, quantity: number | null) => Promise<void>
    //     deleteShoppingList: (listid: string, userid: string) => Promise<void>
    //     deleteShoppingListItem: (itemid: string, userid: string) => Promise<void>
    //     updateShoppingListItem: (check: boolean, itemid: string) => Promise<void>
    //     getShoppingListItems: (listid: string, userid: string) => Promise<Array<QueryResultRow>>
    //     getShoppingLists: (userid: string) => Promise<Array<QueryResultRow>>
    // },
    Feedback: {
        createNewFeedback: createNewFeedback
    },
    History: {
        deleteElementFromHistory: deleteElementFromHistory,
        getElements: getElements,
        updateHistory: updateHistory
    },
    Password: {
        updatePassword: updatePassword
    },
    User: {
        createUser: createUser,
        createUserOAuth: createUserOAuth,
        getUser: getUser,
        deleteUser: deleteUser,
        getPasswordResetToken: getPasswordResetToken,
        setPasswordResetToken: setPasswordResetToken
    },
    Settings: {
        createSetting: createSettings,
        deleteAlertSetting: deleteSettings,
        getAlertSettings: getSettings,
        getRestrictionIdByName: getRestrictionIdByName,
        updateAlertSetting: updateSettings,
        userHasRestriction: userHasRestriction
    },
    ResetPassword: {
        updatePassword: updatePassword
    },
    TrendingProducts: {
        getTrendingGlobal: getTrendingGlobal,
        getTrendingLocal: getTrendingLocal,
        insert: insert,
        getCountryCode: getCountryCode
    },
    // OAuth: {
    //     getProviderByName: (name: string) => Promise<QueryResultRow>
    // },
    connect: async () => {},
    end: async () => {}
}

const init = () => {
    init_db(mock_db)
}

export default { init }
