"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const logger_1 = __importDefault(require("./src/middleware/logger"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const index_1 = __importDefault(require("./src/routes/index")); //DIR_IMPORT NOT SUPPORTED
const historyRoutes_1 = __importDefault(require("./src/routes/historyRoutes")); //DIR_IMPORT NOT SUPPORTED
const productRoutes_1 = __importDefault(require("./src/routes/productRoutes")); //DIR_IMPORT NOT SUPPORTED
const settingsRoutes_1 = __importDefault(require("./src/routes/settingsRoutes")); //DIR_IMPORT NOT SUPPORTED
const userRoutes_1 = __importDefault(require("./src/routes/userRoutes")); //DIR_IMPORT NOT SUPPORTED
// import { HOST, PORT} from './src/config/index';
const PORT = process.env.PORT;
const app = (0, express_1.default)();
const server = new http_1.default.Server(app);
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors")); //dont know what is it for
const options = {
    apis: ["./src/routes/*.ts"],
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Dynafood API",
            version: "1.0.0",
            description: "Api to get Food-information"
        },
        servers: [
            {
                url: "http://localhost:8081"
            }
        ]
    }
};
const specs = (0, swagger_jsdoc_1.default)(options);
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: '200kb' }));
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(specs));
app.use(index_1.default);
app.use(userRoutes_1.default);
app.use(settingsRoutes_1.default);
app.use(historyRoutes_1.default);
app.use(productRoutes_1.default);
app.use(logger_1.default);
server.listen(PORT, () => console.log(`[LOGGER] The server is listening on port ${PORT}`));
