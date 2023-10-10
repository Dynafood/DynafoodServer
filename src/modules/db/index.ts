import pg from 'pg';
import { createNewFeedback } from './feedback';
import { createShoppingList, createShoppingListItem, deleteShoppingList, deleteShoppingListItem, getShoppingListItems, getShoppingLists, updateShoppingListItem, updateShoppingList } from './shoppingList'
import { deleteElementFromHistory, getElements, updateHistory } from './historyManagement';
import { updatePassword } from './resetPassword';
import { updateAlertSetting, getAlertSettings, getRestrictionIdByName, userHasRestriction, deleteAlertSetting, createSetting, getAllSettings } from './settingsManagement';
import { getEmailConfirmed, setEmailConfirmed, createUser, createUserOAuth, deleteUser, getUser, getPasswordResetToken, setPasswordResetToken, updateUserByRefreshToken } from './userManagement';
import { insert, getTrendingLocal, getTrendingGlobal, getCountryCode } from './trendingProducts';
import { DatabaseInterface } from '../../../server_config';
import { getProviderByName } from './oauth';
import { getAllergenbyName, directQuery } from './search';
import { getProductByBarcode, getAllergensByBarcode, getCategoriesByBarcode, getIngredientsByBarcode, getProductsByName } from './product';
import { cleanDublicateInvalidData, deleteElementFromInvalidData, getElementsFromInvalidData, insertIntoInvalidData, updateInvalidData, updateInvalidDataElement } from './invalidDataManagements';

// console.log('this is db_vars:', process.env.NODE_ENV, process.env.DB_USER, process.env.PG_PASSWORD, process.env.DB_PORT, process.env.DB_HOST, process.env.DB_DATABASE);

const connect = async () => {
    const connectionString: string = `postgresql://${process.env.PG_USER}:${process.env.PG_PASSWORD}@${process.env.PG_HOST}:${process.env.PG_PORT}/${process.env.PG_DATABASE}`;

    if (process.env.NODE_ENV !== 'production') {
        console.log('connect by using', connectionString);
        db_adm_conn = new pg.Pool({
            connectionString: connectionString,
        });
    } else {
        console.log('connect by using', process.env.DATABASE_URL);
        db_adm_conn = new pg.Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: {
                rejectUnauthorized: false
            }
        });
    }

    await db_adm_conn.connect();
};

const end = async () => {
    await db_adm_conn.end();
};
const Database: DatabaseInterface = {
    Query: {
        query: directQuery
    },
    ShoppingList: {
        createShoppingList,
        updateShoppingList,
        createShoppingListItem,
        deleteShoppingList,
        deleteShoppingListItem,
        updateShoppingListItem,
        getShoppingListItems,
        getShoppingLists
    },
    Feedback: {
        createNewFeedback
    },
    Password: {
        updatePassword
    },
    User: {
        createUser,
        createUserOAuth,
        deleteUser,
        getUser,
        getPasswordResetToken,
        setPasswordResetToken,
        setEmailConfirmed,
        getEmailConfirmed,
        updateUserByRefreshToken
    },
    Settings: {
        getRestrictionIdByName,
        userHasRestriction,
        getAlertSettings,
        getAllSettings,
        updateAlertSetting,
        deleteAlertSetting,
        createSetting
    },
    History: {
        deleteElementFromHistory,
        getElements,
        updateHistory
    },
    ResetPassword: {
        updatePassword
    },
    TrendingProducts: {
        getTrendingGlobal,
        getTrendingLocal,
        insert,
        getCountryCode,
    },
    OAuth: {
        getProviderByName,
    },
    Search: {
        getAllergenbyName,
    },
    Product: {
        getProductByBarcode,
        getAllergensByBarcode,
        getCategoriesByBarcode,
        getIngredientsByBarcode,
        getProductsByName
    },
    InvalidDataManagement: {
        updateInvalidData,
        cleanDublicateInvalidData,
        updateInvalidDataElement,
        insertIntoInvalidData,
        deleteElementFromInvalidData,
        getElementsFromInvalidData,
    },
    connect,
    end
};
export default Database;
export let db_adm_conn: pg.Pool;
