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
exports.getElementsFromHistory = exports.deleteElementFromHistory = exports.insertIntoHistory = exports.updateHistoryElement = exports.cleanDublicateHistory = exports.updateHistory = void 0;
const index_1 = require("./index");
const scripts_1 = require("./scripts");
const updateHistory = (userID, barcode, product) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield index_1.db_adm_conn.query(`
    SELECT COUNT (historyId)
    FROM History
    WHERE barcode = '${(0, scripts_1.checkInputBeforeSqlQuery)(barcode)}'
        AND enduserId = '${(0, scripts_1.checkInputBeforeSqlQuery)(userID)}';`);
    if (response.rows[0].count === 1) {
        yield (0, exports.updateHistoryElement)(userID, barcode, product);
    }
    else {
        if (response.rows[0].count > 1) {
            yield (0, exports.cleanDublicateHistory)(userID, barcode);
        }
        yield (0, exports.insertIntoHistory)(userID, barcode, product);
    }
});
exports.updateHistory = updateHistory;
const cleanDublicateHistory = (userID, barcode) => __awaiter(void 0, void 0, void 0, function* () {
    yield index_1.db_adm_conn.query(`
    DELETE
    FROM History
    WHERE barcode = '${(0, scripts_1.checkInputBeforeSqlQuery)(barcode)}'
        AND enduserId = '${(0, scripts_1.checkInputBeforeSqlQuery)(userID)}';`);
});
exports.cleanDublicateHistory = cleanDublicateHistory;
const updateHistoryElement = (userID, barcode, product) => __awaiter(void 0, void 0, void 0, function* () {
    product.name = (0, scripts_1.checkInputBeforeSqlQuery)(product.name);
    product.images = (0, scripts_1.checkInputBeforeSqlQuery)(product.images);
    yield index_1.db_adm_conn.query(`
    UPDATE History
    SET (lastused, productName, pictureLink)
       = (current_timestamp, '${product.name}', '${product.images}')
    WHERE barcode = '${(0, scripts_1.checkInputBeforeSqlQuery)(barcode)}'
        AND enduserId = '${(0, scripts_1.checkInputBeforeSqlQuery)(userID)}';`);
});
exports.updateHistoryElement = updateHistoryElement;
const insertIntoHistory = (userID, barcode, product) => __awaiter(void 0, void 0, void 0, function* () {
    userID = (0, scripts_1.checkInputBeforeSqlQuery)(userID);
    barcode = (0, scripts_1.checkInputBeforeSqlQuery)(barcode);
    product.name = (0, scripts_1.checkInputBeforeSqlQuery)(product.name);
    product.images = (0, scripts_1.checkInputBeforeSqlQuery)(product.images);
    yield index_1.db_adm_conn.query(`
    INSERT INTO history (endUserID, barcode, productName, pictureLink)
    VALUES ('${userID}', '${barcode}', '${product.name}', '${product.images}');`);
});
exports.insertIntoHistory = insertIntoHistory;
const deleteElementFromHistory = (elementid, userid) => __awaiter(void 0, void 0, void 0, function* () {
    const elementID = (0, scripts_1.checkInputBeforeSqlQuery)(elementid);
    yield index_1.db_adm_conn.query(`
    DELETE FROM history
    WHERE historyID = '${elementID}' AND enduserid = '${(0, scripts_1.checkInputBeforeSqlQuery)(userid)}';`);
});
exports.deleteElementFromHistory = deleteElementFromHistory;
const getElementsFromHistory = (userid) => __awaiter(void 0, void 0, void 0, function* () {
    const userID = (0, scripts_1.checkInputBeforeSqlQuery)(userid);
    const response = yield index_1.db_adm_conn.query(`
    SELECT H.historyID, H.barcode, H.productName, H.lastUsed, H.pictureLink
    FROM History H
    JOIN EndUser EU ON EU.endUserID = H.endUserID
    WHERE EU.endUserID = '${userID}'
    ORDER BY H.lastused DESC;`);
    return response.rows;
});
exports.getElementsFromHistory = getElementsFromHistory;
