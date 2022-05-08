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
exports.checkCreateUserReq = exports.checkUserIdReq = void 0;
const index_1 = require("../../modules/db/index");
const scripts_1 = require("../../modules/db/scripts");
const joi_1 = __importDefault(require("joi"));
const schema = joi_1.default.object({
    firstName: joi_1.default.string()
        .pattern(new RegExp('^[a-zA-Z\s\-]'))
        .min(3)
        .max(20)
        .required(),
    lastName: joi_1.default.string()
        .pattern(new RegExp('^[a-zA-Z\s\-]'))
        .min(3)
        .max(20)
        .required(),
    userName: joi_1.default.string()
        .pattern(new RegExp('^[a-zA-Z0-9]'))
        .min(3)
        .max(20)
        .required(),
    email: joi_1.default.string()
        .email({
        minDomainSegments: 2,
        tlds: {
            allow: ['com', 'net', 'eu', 'de', 'fr']
        }
    })
        .required(),
    phoneNumber: joi_1.default.string()
        .pattern(new RegExp('^[0-9\s\+]'))
        .min(8)
        .max(20)
        .required(),
    password: joi_1.default.string()
        .min(8)
        .max(72)
        .required()
});
const checkUserIdReq = (req, res, next) => {
    if (typeof res.locals.user.userid == 'undefined' || res.locals.user.userid === null) {
        res.status(400).send({ "Error": "No valid token provided." });
        return;
    }
    next();
};
exports.checkUserIdReq = checkUserIdReq;
const checkCreateUserReq = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { error, value } = schema.validate(req.body);
    if (error != undefined) {
        res.status(400).send({ "Error": error });
        return;
    }
    let prevCheckEmail = yield index_1.db_adm_conn.query(`
        SELECT email
        FROM EndUser
        WHERE email = '${(0, scripts_1.checkInputBeforeSqlQuery)(req.body.email)}'`);
    if (prevCheckEmail.rowCount != 0) {
        res.status(409).send({ "Error": "email already exists" });
        return;
    }
    next();
});
exports.checkCreateUserReq = checkCreateUserReq;
