import { DatabaseInterface, init_db } from "../../../../server_config"
import { JsonObject } from "swagger-ui-express";
import { createUser, deleteUser, getUser, createUserOAuth, getPasswordResetToken, setPasswordResetToken } from "./mock_user";
import { createNewFeedback } from "./mock_feedback";
import { createSettings, deleteSettings, getRestrictionIdByName, getSettings, updateSettings, userHasRestriction } from "./mock_settings";
import { deleteElementFromHistory, getElements, updateHistory } from "./mock_history";
import { QueryResultRow } from "pg";
import { updatePassword } from "./mock_password";
import { createShoppingList, createShoppingListItem, deleteShoppingList, deleteShoppingListItem, getShoppingListItems, getShoppingLists, updateShoppingList, updateShoppingListItem } from "./mock_shoppinglist";
import { getTrendingGlobal, getCountryCode, getTrendingLocal, insert } from "./mock_trending";
import { getAllergenbyName } from "./mock_search";
import { getAllergensByBarcode, getCategoriesByBarcode, getIngredientsByBarcode, getProductByBarcode, getProductsByName } from "./mock_product";
import { getEmailConfirmed, setEmailConfirmed } from "../../../../src/modules/db/userManagement";




const mock_db: DatabaseInterface = {
    ShoppingList: {
        createShoppingList: createShoppingList,
        createShoppingListItem: createShoppingListItem,
        deleteShoppingList: deleteShoppingList,
        deleteShoppingListItem: deleteShoppingListItem,
        updateShoppingListItem: updateShoppingListItem,
        updateShoppingList: updateShoppingList,
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
        setPasswordResetToken: setPasswordResetToken,
        setEmailConfirmed: setEmailConfirmed,
        getEmailConfirmed: getEmailConfirmed
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
    Product: {
        getProductByBarcode,
        getAllergensByBarcode,
        getCategoriesByBarcode,
        getIngredientsByBarcode,
        getProductsByName
    },
    connect: async () => {throw "ErrorMock"},
    end: async () => {throw "ErrorMock"}
}

const init = () => {
    init_db(mock_db)
}

export default { init }