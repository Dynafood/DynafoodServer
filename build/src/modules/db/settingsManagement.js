"use strict";
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
exports.deleteSettings = exports.patchSettings = exports.postSettings = exports.getSettings = void 0;
//import { db_adm_conn } from "./index";
const scripts_1 = require("./scripts");
const index_1 = __importDefault(require("./index"));
const getSettings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let userSettings = yield index_1.default.query(`
                SELECT R.restrictionName, ER.alertActivation 
                FROM Restriction R
                LEFT JOIN EndUser_Restriction ER ON ER.restrictionID = R.restrictionID
                WHERE ER.endUserID = '${(0, scripts_1.checkInputBeforeSqlQuery)(res.locals.user.userid)}';`);
        if (userSettings.rows.length == 0) {
            res.status(204).send();
            return;
        }
        res.status(200).send(userSettings.rows);
    }
    catch (err) {
        console.log(err);
        res.status(500).send({ "Error": err, "Details": err.stack });
    }
});
exports.getSettings = getSettings;
/*
    currently there are only the restrictions 'deez' & 'nutz' hardcoded in the database
    body:
    {
        restrictionName: '',
        alertActivation: (true of false),
    }
*/
const postSettings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let newSettings = yield index_1.default.query(`
            INSERT INTO EndUser_Restriction (alertActivation, endUserId, restrictionID)
            SELECT
                ${(0, scripts_1.checkInputBeforeSqlQuery)(req.body.alertActivation)},
                '${(0, scripts_1.checkInputBeforeSqlQuery)(res.locals.user.userid)}',
                '${(0, scripts_1.checkInputBeforeSqlQuery)(res.locals.restrictionID)}'
            WHERE NOT EXISTS (SELECT * FROM EndUser_Restriction EU
            WHERE EU.endUserID = '${(0, scripts_1.checkInputBeforeSqlQuery)(res.locals.user.userid)}'
            AND EU.restrictionID = '${(0, scripts_1.checkInputBeforeSqlQuery)(res.locals.restrictionID)}');
        `);
        res.status(200).send();
    }
    catch (err) {
        console.log(err);
        res.status(500).send({ "Error": err, "Details": err.stack });
    }
});
exports.postSettings = postSettings;
const patchSettings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let newSettings = yield index_1.default.query(`
            UPDATE EndUser_Restriction
            SET alertActivation = ${(0, scripts_1.checkInputBeforeSqlQuery)(req.body.alertActivation)}
            WHERE restrictionID = '${(0, scripts_1.checkInputBeforeSqlQuery)(res.locals.restrictionID)}'
            AND endUserID = '${(0, scripts_1.checkInputBeforeSqlQuery)(res.locals.user.userid)}';
        `);
        res.status(200).send();
    }
    catch (err) {
        console.log(err);
        res.status(500).send({ "Error": err, "Details": err.stack });
    }
});
exports.patchSettings = patchSettings;
const deleteSettings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let newSettings = yield index_1.default.query(`
            DELETE FROM EndUser_Restriction
            WHERE restrictionID = '${(0, scripts_1.checkInputBeforeSqlQuery)(res.locals.restrictionID)}'
            AND endUserID = '${(0, scripts_1.checkInputBeforeSqlQuery)(res.locals.user.userid)}';
        `);
        res.status(200).send(newSettings.rows);
    }
    catch (err) {
        console.log(err);
        res.status(500).send({ "Error": err, "Details": err.stack });
    }
});
exports.deleteSettings = deleteSettings;
