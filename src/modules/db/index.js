"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = exports.getEcho = exports.whatTimePGQL = exports.showTables = exports.db_adm_conn = void 0;
const pg_1 = __importDefault(require("pg"));
// import { PG_USER, PG_PASSWORD, PG_HOST, PG_PORT, PG_DATABASE } from '../../config/index';
const dotenv = __importStar(require("dotenv"));
dotenv.config();
console.log('this is db_vars:', process.env.DB_USER, process.env.DB_PORT, process.env.DB_HOST, process.env.DB_DATABASE);
// const connectionString =  'postgres://' + process.env.DB_USER + ':' + process.env.DB_PASSWORD + DB_STRING
const connectionString = `postgresql://${process.env.PG_USER}:${process.env.PG_PASSWORD}@${process.env.PG_HOST}:${process.env.PG_PORT}/${process.env.PG_DATABASE}`;
if (process.env.NODE_ENV !== 'production') {
    exports.db_adm_conn = new pg_1.default.Client({
        connectionString
    });
}
else {
    exports.db_adm_conn = new pg_1.default.Client({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    });
}
exports.db_adm_conn.connect();
const showTables = (req, res) => {
    exports.db_adm_conn.query('SELECT table_schema,table_name FROM information_schema.tables;', (err, res) => {
        if (err)
            throw err;
        for (const row of res.rows) {
            console.log(JSON.stringify(row));
        }
    });
    res.status(200).json({ msg: 'showtables function' });
};
exports.showTables = showTables;
const whatTimePGQL = (req, res) => {
    exports.db_adm_conn.query('SELECT NOW()', (err, result) => {
        if (err) {
            res.status(500).json(err.stack);
            return console.error('Error executing query', err.stack);
        }
        console.log(result.rows);
        res.status(200).send(result.rows);
    });
};
exports.whatTimePGQL = whatTimePGQL;
const getEcho = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send(JSON.stringify(req.query));
});
exports.getEcho = getEcho;
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('[LOGGER], getUsers func');
    res.send(yield exports.db_adm_conn.query('SELECT * FROM EndUser'));
});
exports.getUsers = getUsers;
exports.default = exports.db_adm_conn;
// export const poolExample = () => {
//     console.log('[EXAMPLE] I am DB Pool example func')
//     const pool = new Pool({
//         connectionString: connectionString,
//         max: 20,
//         idleTimeoutMillis: 30000,
//         connectionTimeoutMillis: 2000,
//     })
//     pool.connect((err, client, release) => {
//         if (err) {
//             return console.error('Error acquiring client', err.stack)
//         }
//         client.query('SELECT NOW()', (err, result) => {
//             release()
//             if (err) {
//             return console.error('Error executing query', err.stack)
//             }
//         console.log(result.rows)
//         })
//     })
// }
// export function connect() {
//     let db_adm_conn = new Client({
//         connectionString : connectionString
//     });
//     db_adm_conn.on('error', error => {
//         connect();
//     });
//     db_adm_conn.connect().catch(() => { connect() });
//     return db_adm_conn
// }
// export let db_adm_conn = connect()
