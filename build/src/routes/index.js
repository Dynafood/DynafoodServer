"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const express_2 = require("express");
const express_3 = require("express");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
//import { getEcho, getUsers } from '../modules/db/index'
const index_1 = require("../modules/db/index");
const logger_1 = __importDefault(require("../middleware/logger"));
// import { dbPool2 } from '../modules/sketches/herokupgsql'
router.use((0, express_3.json)({ limit: '200kb' }));
router.use((0, express_2.urlencoded)({ extended: true }));
router.use((0, cookie_parser_1.default)());
router.use(logger_1.default);
router.get('/welcome', (req, res) => {
    res.status(200).send("Welcome 🙌 ");
});
//DB TEST FUNCS
// router.get('/pg', dbPool2)
router.get('/pgtables', index_1.showTables);
router.get('/echo', index_1.getEcho);
router.get('/users', index_1.getUsers); //should delete later
exports.default = router;
