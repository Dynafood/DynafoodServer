import { QueryResultRow } from "pg"
import { DatabaseInterface, init_db } from "../../../../server_config"
import { create, remove } from "./mock_bookmarking"
import { createNewFeedback } from "./mock_feedback";
import { deleteElementFromHistory, getElements, updateHistory } from "./mock_history";
import { updatePassword } from "./mock_password";
import { createSettings, deleteSettings, getSettings, getRestrictionIdByName, updateSettings, userHasRestriction, getAllSettings } from "./mock_settings";
import { createShoppingList, createShoppingListItem, deleteShoppingList, deleteShoppingListItem, updateShoppingListItem, getShoppingListItems, getShoppingLists, updateShoppingList } from "./mock_shoppinglist";
import { getTrendingGlobal, getTrendingLocal, insert, getCountryCode } from "./mock_trending";
import { createUser, createUserOAuth, deleteUser, getPasswordResetToken, setPasswordResetToken, updateRefreshToken, createRefreshToken } from "./mock_user";
import { getAllergenbyName } from "./mock_search";
import { getProductByBarcode, getAllergensByBarcode, getCategoriesByBarcode, getIngredientsByBarcode, getProductsByName, getDrinkCategories } from "./mock_product";
import { getEmailConfirmed, setEmailConfirmed } from "../../../../src/modules/db/userManagement";

export const getUser = async (userid: string | null = null, email: string | null = null) : Promise<Array<QueryResultRow>> => {
    throw new Error("ErrorMock")
}


const mock_db: DatabaseInterface = {
    Query: {
        query: (text: string) => {return new Promise(() => {})}
    },
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
        getEmailConfirmed: getEmailConfirmed,
        updateRefreshToken: updateRefreshToken,
        createRefreshToken: createRefreshToken
    },
    Settings: {
        getAllSettings: getAllSettings,
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
        getProviderByName: async (name: string) : Promise<QueryResultRow> => {throw new Error("ErrorMock")}
    },
    Search: {
        getAllergenbyName: getAllergenbyName
    },
    Product: {
        getProductByBarcode,
        getAllergensByBarcode,
        getCategoriesByBarcode,
        getIngredientsByBarcode,
        getProductsByName,
        getDrinkCategories
    },
    Bookmarking: {
        create,
        remove
    },
    connect: async () => {throw new Error("ErrorMock")},
    end: async () => {throw new Error("ErrorMock")}
}

const init = () => {
    init_db(mock_db)
}

export default { init }