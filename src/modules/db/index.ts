import pg from 'pg';
import * as dotenv from 'dotenv';
import { createNewFeedback } from './feedback';
import { cleanDublicateHistory, deleteElementFromHistory, getElements, insertIntoHistory, updateHistory, updateHistoryElement } from './historyManagement';
import { updatePassword } from './resetPassword';
import { updateAlertSetting, getAlertSettings, getRestrictionIdByName, userHasRestriction, deleteAlertSetting, createSetting } from './settingsManagement';
import { createUser, deleteUser, getUser } from './userManagement';
import { DatabaseInterface } from '../../../server_config';

dotenv.config();

console.log('this is db_vars:', process.env.NODE_ENV, process.env.DB_USER, process.env.PG_PASSWORD, process.env.DB_PORT, process.env.DB_HOST, process.env.DB_DATABASE);

const connect = async () => {
    const connectionString: string = `postgresql://${process.env.PG_USER}:${process.env.PG_PASSWORD}@${process.env.PG_HOST}:${process.env.PG_PORT}/${process.env.PG_DATABASE}`;

    if (process.env.NODE_ENV !== 'production') {
        console.log('connect by using', connectionString);
        db_adm_conn = new pg.Client({
            connectionString
        });
    } else {
        console.log('connect by using', process.env.DATABASE_URL);
        db_adm_conn = new pg.Client({
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
    Feedback: {
        createNewFeedback
    },
    Password: {
        updatePassword
    },
    User: {
        createUser,
        deleteUser,
        getUser
    },
    Settings: {
        getRestrictionIdByName,
        userHasRestriction,
        getAlertSettings,
        updateAlertSetting,
        deleteAlertSetting,
        createSetting
    },
    History: {
        cleanDublicateHistory,
        deleteElementFromHistory,
        getElements,
        insertIntoHistory,
        updateHistory,
        updateHistoryElement
    },
    connect,
    end
};
export default Database;
export let db_adm_conn: pg.Client;
