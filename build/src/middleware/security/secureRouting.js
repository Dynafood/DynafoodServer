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
exports.secureRouteMiddleware = exports.checkUserExists = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const index_1 = require("../../modules/db/index");
const scripts_1 = require("../../modules/db/scripts");
const checkUserExists = (user) => __awaiter(void 0, void 0, void 0, function* () {
    let response = yield index_1.db_adm_conn.query(`
    SELECT COUNT(enduserid) FROM enduser WHERE enduserid = '${(0, scripts_1.checkInputBeforeSqlQuery)(user.userid)}'`);
    if (response.rows[0].count == 1) {
        return true;
    }
    return false;
});
exports.checkUserExists = checkUserExists;
const secureRouteMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies.token;
    let header_token = req.headers['authorization'];
    if (typeof token != "undefined" && token != null) {
        try {
            const user = (jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET));
            res.locals.user = user;
            if (!(yield (0, exports.checkUserExists)(user)))
                throw "user does not exist";
            next();
        }
        catch (error) {
            res.clearCookie("token");
            res.status(401).send({ "Error": "401 Unauthorized" });
        }
    }
    else if (typeof header_token != "undefined" && header_token != null) {
        try {
            if (header_token.indexOf("Bearer ") != 0)
                throw "no valid bearer";
            header_token = header_token.substring(7);
            const user = (jsonwebtoken_1.default.verify(header_token, process.env.JWT_SECRET));
            res.locals.user = user;
            if (!(yield (0, exports.checkUserExists)(user)))
                throw "user does not exist";
            next();
        }
        catch (error) {
            res.status(401).send({ "Error": "401 Unauthorized" });
        }
    }
    else {
        res.status(401).send({ "Error": "401 Unauthorized" });
    }
});
exports.secureRouteMiddleware = secureRouteMiddleware;
