import { DatabaseInterface, init_db } from "../../../../server_config"
import { createUser, deleteUser, getUser, setPasswordResetToken, createUserOAuth, getPasswordResetToken, setEmailConfirmed, getEmailConfirmed, updateRefreshToken, createRefreshToken } from "./mock_user";
import { createNewFeedback, createContactForm } from "./mock_feedback";
import { updateHistory, getElements, deleteElementFromHistory } from "./mock_history";
import { insert, getCountryCode, getTrendingGlobal, getTrendingLocal} from "./mock_trendingProduct"
import { createSettings, deleteSettings, getRestrictionIdByName, getSettings, getAllSettings, updateSettings, userHasRestriction } from "./mock_settings";
import { updatePassword } from "./mock_password"
import { check, create, remove } from "./mock_bookmarking"
import { createShoppingList, createShoppingListItem, deleteShoppingList, deleteShoppingListItem, getShoppingListItems, getShoppingLists, updateShoppingList, updateShoppingListItem } from "./mock_shoppinglist"
import { QueryResultRow } from "pg";
import {getAllergenbyName} from "./mock_search";
import { getProductByBarcode, getAllergensByBarcode, getCategoriesByBarcode, getIngredientsByBarcode, getProductsByName, getDrinkCategories } from "./mock_product";
import { cleanDublicateInvalidData, deleteElementFromInvalidData, getElementsFromInvalidData, insertIntoInvalidData, updateInvalidData, updateInvalidDataElement } from "./mock_invalidData";

const directQuery = (quer: string) => {
    return new Promise((resolve, reject) => {
        resolve({rowCount: 1, rows: []})
    })
}

const mock_db: DatabaseInterface = {
    Query: {
        query: directQuery
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
        createNewFeedback: createNewFeedback,
        createContactForm: createContactForm
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
        createSetting: createSettings,
        deleteAlertSetting: deleteSettings,
        getAlertSettings: getSettings,
        getAllSettings: getAllSettings,
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
        getProductsByName,
        getDrinkCategories
    },
    Bookmarking: {
        create,
        remove,
        check
    },
    InvalidDataManagement: {
        updateInvalidData: updateInvalidData,
        cleanDublicateInvalidData: cleanDublicateInvalidData,
        updateInvalidDataElement: updateInvalidDataElement,
        insertIntoInvalidData: insertIntoInvalidData,
        deleteElementFromInvalidData: deleteElementFromInvalidData,
        getElementsFromInvalidData: getElementsFromInvalidData,
    },
    connect: async () : Promise<void> => {},
    end: async () : Promise<void> => {}
}

const init = () => {
    init_db(mock_db)
}

export default { init }
