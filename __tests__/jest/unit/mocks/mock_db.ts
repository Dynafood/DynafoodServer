import { DatabaseInterface, init_db } from "../../../../server_config"
import { JsonObject } from "swagger-ui-express";
import { createUser, deleteUser, getUser, setPasswordResetToken, createUserOAuth, getPasswordResetToken } from "./mock_user";
import { createNewFeedback } from "./mock_feedback";
import { updateHistory, getElements, deleteElementFromHistory } from "./mock_history";
import { insert, getCountryCode, getTrendingGlobal, getTrendingLocal} from "./mock_trendingProduct"
import { createSettings, deleteSettings, getRestrictionIdByName, getSettings, updateSettings, userHasRestriction } from "./mock_settings";
import { updatePassword } from "./mock_password"
import { createShoppingList, createShoppingListItem, deleteShoppingList, deleteShoppingListItem, getShoppingListItems, getShoppingLists, updateShoppingList, updateShoppingListItem } from "./mock_shoppinglist"
import { QueryResultRow } from "pg";
import {getAllergenbyName} from "./mock_search";
import { getProductByBarcode, getAllergensByBarcode, getCategoriesByBarcode, getIngredientsByBarcode, getProductsByName } from "./mock_product";



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
        getProviderByName: async (name: string) : Promise<QueryResultRow> => {return{}}
    },
    Search: {
        getAllergenbyName: getAllergenbyName,
    },
    Product : {
        getProductByBarcode,
        getAllergensByBarcode,
        getCategoriesByBarcode,
        getIngredientsByBarcode,
        getProductsByName
    },
    connect: async () : Promise<void> => {},
    end: async () : Promise<void> => {}
}

const init = () => {
    init_db(mock_db)
}

export default { init }
