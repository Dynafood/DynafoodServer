import { QueryResultRow } from "pg"
import { DatabaseInterface, init_db } from "../../../../server_config"
import { JsonObject } from "swagger-ui-express";
import { createNewFeedback } from "./mock_feedback";
import { deleteElementFromHistory, getElements, updateHistory } from "./mock_history";
import { updatePassword } from "./mock_password";
import { createSettings, deleteSettings, getSettings, getRestrictionIdByName, updateSettings, userHasRestriction } from "./mock_settings";
import { createShoppingList, createShoppingListItem, deleteShoppingList, deleteShoppingListItem, updateShoppingListItem, getShoppingListItems, getShoppingLists } from "./mock_shoppinglist";
import { getTrendingGlobal, getTrendingLocal, insert, getCountryCode } from "./mock_trending";
import { createUser, createUserOAuth, deleteUser, getPasswordResetToken, setPasswordResetToken } from "./mock_user";
import { getAllergenbyName } from "./mock_search";

export const getUser = async (userid: string | null = null, email: string | null = null) : Promise<Array<QueryResultRow>> => {
    throw new Error("ErrorMock")
}


const mock_db: DatabaseInterface = {
    ShoppingList: {
        createShoppingList: createShoppingList,
        createShoppingListItem: createShoppingListItem,
        deleteShoppingList: deleteShoppingList,
        deleteShoppingListItem: deleteShoppingListItem,
        updateShoppingListItem: updateShoppingListItem,
        getShoppingListItems: getShoppingListItems,
        getShoppingLists: getShoppingLists
    },
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
    OAuth: {
        getProviderByName: async (name: string) : Promise<QueryResultRow> => {throw "ErrorMock"}
    },
    Search: {
        getAllergenbyName: getAllergenbyName
    },
    connect: async () => {throw "ErrorMock"},
    end: async () => {throw "ErrorMock"}
}

const init = () => {
    init_db(mock_db)
}

export default { init }