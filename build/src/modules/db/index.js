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
exports.db_adm_conn = void 0;
const pg_1 = __importDefault(require("pg"));
const dotenv = __importStar(require("dotenv"));
const feedback_1 = require("./feedback");
const historyManagement_1 = require("./historyManagement");
const resetPassword_1 = require("./resetPassword");
const settingsManagement_1 = require("./settingsManagement");
const userManagement_1 = require("./userManagement");
dotenv.config();
console.log('this is db_vars:', process.env.NODE_ENV, process.env.DB_USER, process.env.PG_PASSWORD, process.env.DB_PORT, process.env.DB_HOST, process.env.DB_DATABASE);
const connect = () => __awaiter(void 0, void 0, void 0, function* () {
    const connectionString = `postgresql://${process.env.PG_USER}:${process.env.PG_PASSWORD}@${process.env.PG_HOST}:${process.env.PG_PORT}/${process.env.PG_DATABASE}`;
    if (process.env.NODE_ENV !== 'production') {
        console.log("connect by using", connectionString);
        exports.db_adm_conn = new pg_1.default.Client({
            connectionString
        });
    }
    else {
        console.log("connect by using", process.env.DATABASE_URL);
        exports.db_adm_conn = new pg_1.default.Client({
            connectionString: process.env.DATABASE_URL,
            ssl: {
                rejectUnauthorized: false
            }
        });
    }
    yield exports.db_adm_conn.connect();
});
const end = () => __awaiter(void 0, void 0, void 0, function* () {
    yield exports.db_adm_conn.end();
});
const Database = {
    Feedback: {
        createNewFeedback: feedback_1.createNewFeedback
    },
    ProductHistory: {
        cleanDublicateHistory: historyManagement_1.cleanDublicateHistory,
        deleteElementFromHistory: historyManagement_1.deleteElementFromHistory,
        getElementsFromHistory: historyManagement_1.getElementsFromHistory,
        insertIntoHistory: historyManagement_1.insertIntoHistory,
        updateHistory: historyManagement_1.updateHistory,
        updateHistoryElement: historyManagement_1.updateHistoryElement
    },
    Password: {
        updatePassword: resetPassword_1.updatePassword
    },
    User: {
        createUser: userManagement_1.createUser,
        deleteUser: userManagement_1.deleteUser,
        getUser: userManagement_1.getUser
    },
    Settings: {
        getRestrictionIdByName: settingsManagement_1.getRestrictionIdByName,
        userHasRestriction: settingsManagement_1.userHasRestriction,
        getAlertSettings: settingsManagement_1.getAlertSettings,
        updateAlertSetting: settingsManagement_1.updateAlertSetting,
        deleteAlertSetting: settingsManagement_1.deleteAlertSetting
    },
    connect,
    end
};
exports.default = Database;
