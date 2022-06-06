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
exports.hasRestriction = exports.getRestrictionIdByName = void 0;
const index_1 = require("../modules/db/index");
const scripts_1 = require("./../modules/db/scripts");
const getRestrictionIdByName = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const restrictionID = yield index_1.db_adm_conn.query(`
            SELECT restrictionID
            FROM Restriction
            WHERE restrictionName = '${req.body.restrictionName}'
        `);
        if (restrictionID.rowCount === 0) {
            res.status(404).json({ Error: `The restriction ${req.body.restrictionName} is not available on dynafood!` });
            return;
        }
        res.locals.restrictionID = restrictionID.rows[0].restrictionid;
        next();
    }
    catch (err) {
        console.error(err);
        res.status(500).send({ Error: err, Details: err.stack });
    }
});
exports.getRestrictionIdByName = getRestrictionIdByName;
const hasRestriction = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const restriction = yield index_1.db_adm_conn.query(`
            SELECT * FROM EndUser_Restriction
            WHERE endUserID = '${(0, scripts_1.checkInputBeforeSqlQuery)(res.locals.user.userid)}'
            AND restrictionID = '${(0, scripts_1.checkInputBeforeSqlQuery)(res.locals.restrictionID)}'
        `);
        if (restriction.rowCount === 0) {
            res.status(400).send({ Error: 'Bad request', Details: `This user does not have a restriction for ${req.body.restrictionName}.` });
            return;
        }
        next();
    }
    catch (err) {
        console.error(err);
        res.status(500).send({ Error: err, Details: err.stack });
    }
});
exports.hasRestriction = hasRestriction;
