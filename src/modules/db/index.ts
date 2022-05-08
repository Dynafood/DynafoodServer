import pg from 'pg';
import * as dotenv from 'dotenv';
import feedback from "./feedback";
import {cleanDublicateHistory, deleteElementFromHistory, getElementsFromHistory, insertIntoHistory, updateHistory, updateHistoryElement} from "./historyManagement";
import {resetPassword, sendResetPasswordEmail} from "./resetPassword";
import {checkInputBeforeSqlQuery} from "./scripts";
import {deleteSettings, getSettings, patchSettings, postSettings} from "./settingsManagement";
import {createUser, deleteUser, getToken, getUser} from "./userManagement";

dotenv.config();

console.log('this is db_vars:',
    process.env.DB_USER, process.env.DB_PORT, process.env.DB_HOST, process.env.DB_DATABASE);


const connectionString: string = `postgresql://${process.env.PG_USER}:${process.env.PG_PASSWORD}@${process.env.PG_HOST}:${process.env.PG_PORT}/${process.env.PG_DATABASE}`;

export let db_adm_conn: pg.Client;
if (process.env.NODE_ENV !== 'production') {
    db_adm_conn = new pg.Client({
        connectionString
    });
} else {
    db_adm_conn = new pg.Client({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    });
}

db_adm_conn.connect();
