import express, { Express, Request, Response, NextFunction } from 'express'
import http from 'http'
import path from 'path'
import logger from './src/middleware/logger'
import swaggerUI from 'swagger-ui-express'
import swaggerJSDoc from 'swagger-jsdoc'

import mainRouter from './src/routes/index'; //DIR_IMPORT NOT SUPPORTED
import historyRouter from './src/routes/historyRoutes'; //DIR_IMPORT NOT SUPPORTED
import productRouter from './src/routes/productRoutes'; //DIR_IMPORT NOT SUPPORTED
import settingRouter from './src/routes/settingsRoutes'; //DIR_IMPORT NOT SUPPORTED
import userRouter from './src/routes/userRoutes'; //DIR_IMPORT NOT SUPPORTED
// import { HOST, PORT} from './src/config/index';
const PORT: string | undefined = process.env.PORT
const app: Express = express(); 
const server: http.Server = new http.Server(app);
import cookieParser from 'cookie-parser';
import jwt from 'express-jwt';
import cors from 'cors'; //dont know what is it for

const options : object = {
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
}

const specs: object = swaggerJSDoc(options)

app.use(cors());
app.use(express.json({ limit: '200kb' }));
app.use(express.urlencoded({extended: true }));
app.use(cookieParser());
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs))

app.use(mainRouter);
app.use(userRouter);
app.use(settingRouter);
app.use(historyRouter);
app.use(productRouter);
app.use(logger);

server.listen(PORT, (): void =>

console.log(`[LOGGER] The server is listening on port ${PORT}`))