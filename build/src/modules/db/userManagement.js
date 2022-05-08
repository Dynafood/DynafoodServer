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
exports.getToken = exports.createUser = exports.deleteUser = exports.getUser = void 0;
const index_1 = require("./index");
const scripts_1 = require("./scripts");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const parseGetUserResponse = (rows) => {
    let userObj = {
        firstName: rows[0].firstname,
        lastName: rows[0].lastname,
        userName: rows[0].username,
        email: rows[0].email,
        phoneNumber: rows[0].phonenumber,
        restrictons: []
    };
    for (var row of rows) {
        if (!row.restrictionname)
            continue;
        if (row.restrictionname.length != 0)
            userObj.restrictons.push({ alertactivation: row.alertactivation, restrictionName: row.restrictionname });
    }
    return userObj;
};
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let newUser = yield index_1.db_adm_conn.query(`
        SELECT EU.firstName, EU.lastName, EU.userName, EU.email, EU.phoneNumber, ER.alertActivation, R.restrictionName
        FROM EndUser EU
        LEFT JOIN EndUser_Restriction ER ON ER.endUserID = EU.endUserID
        LEFT JOIN Restriction R ON R.restrictionID = ER.restrictionID
        WHERE EU.endUserID = '${(0, scripts_1.checkInputBeforeSqlQuery)(res.locals.user.userid)}';`);
        if (newUser.rows.length == 0) {
            res.status(404).send("There is no EndUser with this id.");
            return;
        }
        res.send(parseGetUserResponse(newUser.rows));
    }
    catch (err) {
        console.log(err.stack);
        res.status(500).send({ "Error": err, "Details": err.stack });
    }
    return;
});
exports.getUser = getUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield index_1.db_adm_conn.query(`
        DELETE FROM EndUser
        WHERE endUserID = '${(0, scripts_1.checkInputBeforeSqlQuery)(res.locals.user.userid)}' RETURNING *;`);
        res.send({ "Deleted": response.rows });
    }
    catch (err) {
        console.log(err.stack);
        res.status(500).send({ "Error": err, "Details": err.stack });
    }
});
exports.deleteUser = deleteUser;
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const passcode = yield bcrypt_1.default.hash(req.body.password, 10);
        let user = yield index_1.db_adm_conn.query(`
        INSERT INTO EndUser (firstName, lastName, userName, email, phoneNumber, passcode, emailConfirmed)
        VALUES 
            (
                '${(0, scripts_1.checkInputBeforeSqlQuery)(req.body.firstName)}',
                '${(0, scripts_1.checkInputBeforeSqlQuery)(req.body.lastName)}',
                '${(0, scripts_1.checkInputBeforeSqlQuery)(req.body.userName)}',
                '${(0, scripts_1.checkInputBeforeSqlQuery)(req.body.email)}',
                '${(0, scripts_1.checkInputBeforeSqlQuery)(req.body.phoneNumber)}', 
                '${(0, scripts_1.checkInputBeforeSqlQuery)(passcode)}',
                true
            ) RETURNING *;`);
        const userid = user.rows[0].enduserid;
        const token = jsonwebtoken_1.default.sign({ userid: userid }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.cookie("token", token, {
            httpOnly: true,
        });
        res.status(200).send(token);
        return;
    }
    catch (error) {
        res.status(400).send({ "Error": "Unable to create new User.", "Details": `${error.stack}` });
        return;
    }
});
exports.createUser = createUser;
const getToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.query.email;
    const password = req.query.password;
    const user = yield index_1.db_adm_conn.query(`
        SELECT *
        FROM EndUser
        WHERE email = '${email}';
    `);
    if (user.rows.length == 0) {
        console.log(`There is no user with the email: ${email}`);
        res.status(404).send({ "Error": `There is no user with the email ${email}` });
        return;
    }
    if (user.rowCount == 0) {
        res.status(404).send({ "Error": `User has no rows` });
        return;
    }
    const correctPassword = yield bcrypt_1.default.compare(password, user.rows[0].passcode);
    if (user.rows[0].email == email && correctPassword) {
        const userid = user.rows[0].enduserid;
        const token = jsonwebtoken_1.default.sign({ userid: userid }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.cookie("token", token, {
            httpOnly: true,
        });
        res.status(200).send(token);
        return;
    }
    res.status(401).send({ "Error": "Wrong credentials" });
});
exports.getToken = getToken;
