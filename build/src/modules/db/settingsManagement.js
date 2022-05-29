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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAlertSetting = exports.updateAlertSetting = exports.getAlertSettings = exports.userHasRestriction = exports.getRestrictionIdByName = void 0;
const scripts_1 = require("./scripts");
const index_1 = require("./index");
const getRestrictionIdByName = (restrictinoName) => __awaiter(void 0, void 0, void 0, function* () {
    const restrictionID = yield index_1.db_adm_conn.query(`
        SELECT restrictionID
        FROM Restriction
        WHERE restrictionName = '${(0, scripts_1.checkInputBeforeSqlQuery)(restrictinoName)}'
    `);
    if (restrictionID.rowCount == 0)
        return null;
    return restrictionID.rows[0].restrictionID;
});
exports.getRestrictionIdByName = getRestrictionIdByName;
const userHasRestriction = (userid, restrictionid) => __awaiter(void 0, void 0, void 0, function* () {
    const restriction = yield index_1.db_adm_conn.query(`
            SELECT * FROM EndUser_Restriction
            WHERE endUserID = '${(0, scripts_1.checkInputBeforeSqlQuery)(userid)}'
            AND restrictionID = '${(0, scripts_1.checkInputBeforeSqlQuery)(restrictionid)}'
        `);
    return restriction.rowCount > 0;
});
exports.userHasRestriction = userHasRestriction;
const getAlertSettings = (userid) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield index_1.db_adm_conn.query(`
    SELECT R.restrictionName, ER.alertActivation
    FROM Restriction R
    LEFT JOIN EndUser_Restriction ER ON ER.restrictionID = R.restrictionID
    WHERE ER.endUserID = '${(0, scripts_1.checkInputBeforeSqlQuery)(userid)}';`);
    return result.rows;
});
exports.getAlertSettings = getAlertSettings;
const updateAlertSetting = (userid, alertActivation, restrictionID) => __awaiter(void 0, void 0, void 0, function* () {
    yield index_1.db_adm_conn.query(`
            INSERT INTO EndUser_Restriction (alertActivation, endUserId, restrictionID)
            SELECT
                ${(0, scripts_1.checkInputBeforeSqlQuery)(alertActivation)},
                '${(0, scripts_1.checkInputBeforeSqlQuery)(userid)}',
                '${(0, scripts_1.checkInputBeforeSqlQuery)(restrictionID)}'
            WHERE NOT EXISTS (SELECT * FROM EndUser_Restriction EU
            WHERE EU.endUserID = '${(0, scripts_1.checkInputBeforeSqlQuery)(userid)}'
            AND EU.restrictionID = '${(0, scripts_1.checkInputBeforeSqlQuery)(restrictionID)}');
        `);
});
exports.updateAlertSetting = updateAlertSetting;
const deleteAlertSetting = (userid, restrictionID) => __awaiter(void 0, void 0, void 0, function* () {
    const deleted = yield index_1.db_adm_conn.query(`
            DELETE FROM EndUser_Restriction
            WHERE restrictionID = '${(0, scripts_1.checkInputBeforeSqlQuery)(restrictionID)}'
            AND endUserID = '${(0, scripts_1.checkInputBeforeSqlQuery)(userid)}';
        `);
    return deleted.rows[0];
});
exports.deleteAlertSetting = deleteAlertSetting;
