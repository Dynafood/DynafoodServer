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
exports.createFeedback = void 0;
const ts_md5_1 = require("ts-md5");
const index_1 = __importDefault(require("./index"));
const scripts_1 = require("./scripts");
const _feedbackReasons = [
    "bug",
    "suggestion",
    "appreciation",
    "comment"
];
const createFeedback = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const content = req.body.content;
    const reason = req.body.reason;
    if (!content || content.length === 0) {
        res.status(404).send({ "Error": "No content provided", "Details": `Content is not provided or empty!` });
        return;
    }
    if (!_feedbackReasons.includes(reason)) {
        res.status(404).send({ "Error": "Reason not valid", "Details": `Given reason '${reason}' is not part of possible reasons: ${_feedbackReasons}!` });
        return;
    }
    try {
        let newFeedback = yield index_1.default.query(`
            INSERT INTO Feedback (reason, content, userhash)
            VALUES ('${(0, scripts_1.checkInputBeforeSqlQuery)(reason)}', '${(0, scripts_1.checkInputBeforeSqlQuery)(content)}', '${(0, scripts_1.checkInputBeforeSqlQuery)(ts_md5_1.Md5.hashStr(res.locals.user.userid))}');
        `);
        res.status(200).send();
    }
    catch (err) {
        console.log(err);
        res.status(500).send({ "Error": err, "Details": err.stack });
    }
});
exports.createFeedback = createFeedback;
