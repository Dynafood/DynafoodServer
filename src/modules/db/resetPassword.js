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
exports.resetPassword = exports.triggerResetPasswordEmail = void 0;
const index_1 = require("./index");
const scripts_1 = require("./scripts");
const bcrypt_1 = __importDefault(require("bcrypt"));
const joi_1 = __importDefault(require("joi"));
const email_1 = require("./../email");
const schema = joi_1.default.object({
    password: joi_1.default.string()
        .min(8)
        .max(72)
        .required()
});
const triggerResetPasswordEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield index_1.db_adm_conn.query(`
            SELECT userName, email, passcode
            FROM endUser
            WHERE endUserID = '${(0, scripts_1.checkInputBeforeSqlQuery)(res.locals.user.userid)}'
        `);
        if (user.rows.length === 0) {
            res.status(404).send({ Error: 'There is no EndUser with that id.' });
            return;
        }
        const email = user.rows[0].email;
        const username = user.rows[0].username;
        (0, email_1.sendResetPasswordEmail)(username, email);
        res.status(200).send({ status: 'OK' });
    }
    catch (err) {
        console.log(err.stack);
        res.status(500).send({ Error: err, Details: err.stack });
    }
});
exports.triggerResetPasswordEmail = triggerResetPasswordEmail;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const oldPassword = req.body.oldPassword;
        const newPassword = yield bcrypt_1.default.hash(req.body.newPassword, 10);
        const user = yield index_1.db_adm_conn.query(`
            SELECT passcode
            FROM endUser
            WHERE endUserID = '${(0, scripts_1.checkInputBeforeSqlQuery)(res.locals.user.userid)}'
        `);
        if (user.rows.length === 0) {
            res.status(404).send({ Error: 'There is no EndUser with this id.' });
            return;
        }
        const currentPassword = user.rows[0].passcode;
        const correctPassword = yield bcrypt_1.default.compare(oldPassword, currentPassword);
        if (!correctPassword) {
            res.status(403).send({ Error: 'Old password is not matching' });
            return;
        }
        const { error } = schema.validate({ password: req.body.newPassword });
        if (error !== undefined) {
            res.status(409).send({ Error: 'New password is not strong enough' });
            return;
        }
        yield index_1.db_adm_conn.query(`
            UPDATE endUser
            SET passcode = '${newPassword}'
            WHERE endUserID = '${(0, scripts_1.checkInputBeforeSqlQuery)(res.locals.user.userid)}';
        `);
        res.status(200).send({
            status: 'OK: updated password'
        });
    }
    catch (err) {
        console.log(err.stack);
        res.status(500).send({ Error: err, Details: err.stack });
    }
});
exports.resetPassword = resetPassword;
