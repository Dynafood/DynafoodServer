"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const server_config_1 = require("./server_config");
const db_1 = __importDefault(require("./src/modules/db"));
const PORT = process.env.PORT;
const server = new http_1.default.Server(server_config_1.app);
(0, server_config_1.init_db)(db_1.default);
server_config_1.database.connect();
server.listen(PORT, () => console.log(`[LOGGER] The server is listening on port ${PORT}`));
