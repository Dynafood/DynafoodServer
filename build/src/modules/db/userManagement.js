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
exports.deleteUser = exports.getUser = exports.createUser = void 0;
const index_1 = require("./index");
const scripts_1 = require("./scripts");
const createUser = (firstName, lastName, userName, email, phoneNumber, password) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield index_1.db_adm_conn.query(`
        INSERT INTO EndUser (firstName, lastName, userName, email, phoneNumber, passcode, emailConfirmed)
        VALUES
            (
                '${(0, scripts_1.checkInputBeforeSqlQuery)(firstName)}',
                '${(0, scripts_1.checkInputBeforeSqlQuery)(lastName)}',
                '${(0, scripts_1.checkInputBeforeSqlQuery)(userName)}',
                '${(0, scripts_1.checkInputBeforeSqlQuery)(email)}',
                '${(0, scripts_1.checkInputBeforeSqlQuery)(phoneNumber)}',
                '${(0, scripts_1.checkInputBeforeSqlQuery)(password)}',
                true
            ) RETURNING *;`);
    return user.rows[0];
});
exports.createUser = createUser;
const getUser = (userid = null, email = null) => __awaiter(void 0, void 0, void 0, function* () {
    var query = `
    SELECT EU.passcode, EU.firstName, EU.lastName, EU.userName, EU.email, EU.phoneNumber, ER.alertActivation, R.restrictionName
    FROM EndUser EU
    LEFT JOIN EndUser_Restriction ER ON ER.endUserID = EU.endUserID
    LEFT JOIN Restriction R ON R.restrictionID = ER.restrictionID
    `;
    if (userid != null)
        query += `WHERE EU.endUserID = '${(0, scripts_1.checkInputBeforeSqlQuery)(userid)}';`;
    else if (email != null)
        query += `WHERE EU.email = '${(0, scripts_1.checkInputBeforeSqlQuery)(email)}';`;
    else
        throw "one argument must be provided";
    const newUser = yield index_1.db_adm_conn.query(query);
    return newUser.rows;
});
exports.getUser = getUser;
const deleteUser = (userid) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield index_1.db_adm_conn.query(`
        DELETE FROM EndUser
        WHERE endUserID = '${(0, scripts_1.checkInputBeforeSqlQuery)(userid)}' RETURNING *;`);
    return response.rows[0];
});
exports.deleteUser = deleteUser;
