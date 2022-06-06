"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const logger_1 = __importDefault(require("../middleware/logger"));
const router = (0, express_1.Router)();
router.use((0, express_1.json)({ limit: '200kb' }));
router.use((0, express_1.urlencoded)({ extended: true }));
router.use((0, cookie_parser_1.default)());
router.use(logger_1.default);
router.get('/welcome', (req, res) => {
    res.status(200).send('Welcome 🙌 xxx');
});
exports.default = router;
