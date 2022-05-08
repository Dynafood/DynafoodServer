"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkInputBeforeSqlQuery = void 0;
const checkInputBeforeSqlQuery = (arg) => {
    arg = arg.replace("'", "''");
    return arg;
};
exports.checkInputBeforeSqlQuery = checkInputBeforeSqlQuery;
