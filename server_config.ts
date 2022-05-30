import express, { Express } from 'express';
import logger from './src/middleware/logger';
import swaggerUI, { JsonObject } from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

import mainRouter from './src/routes/index';
import historyRouter from './src/routes/historyRoutes';
import productRouter from './src/routes/productRoutes';
import settingRouter from './src/routes/settingsRoutes';
import userRouter from './src/routes/userRoutes';
import resetPasswordRouter from './src/routes/resetPassword';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { QueryResultRow } from 'pg';

export interface DatabaseInterface {
    Feedback: {
        createNewFeedback: (reason: string, content: string, userid: string) => Promise<void>
    }
    ProductHistory: {
        cleanDublicateHistory: (userid: string, barcode: string) => Promise<void>
        deleteElementFromHistory: (elementid: string, userid: string) => Promise<void>
        getElements: (userid: string) => Promise<Array<QueryResultRow>>
        insertIntoHistory: (userID: string, barcode: string, product: JsonObject) => Promise<void>
        updateHistory: (userID: string, barcode: string, product: JsonObject) => Promise<void>
        updateHistoryElement: (userID: string, barcode: string, product: JsonObject) => Promise<void>
    }
    Password: {
        updatePassword: (userid: string, newPassword: string) => Promise<void>
    }
    User: {
        createUser: (firstName: string, lastName: string, userName: string, email: string, phoneNumber: string, password: string) => Promise<QueryResultRow>
        getUser: (userid: string | null, email: string | null) => Promise<Array<QueryResultRow>>
        deleteUser: (userid: string) => Promise<QueryResultRow>
    }
    Settings: {
        getRestrictionIdByName: (restrictinoName: string) => Promise<string | null>
        userHasRestriction: (userid: string, restrictionid: string) => Promise<boolean>
        getAlertSettings: (userid: string) => Promise<Array<QueryResultRow>>
        updateAlertSetting: (userid: string, alertActivation: string, restrictionID: string) => Promise<void>
        deleteAlertSetting: (userid: string, restrictionID: string) => Promise<QueryResultRow>
        createSetting: (alertactivation: string, userid: string, restrictionid: string) => Promise<void>
    }
    connect: () => Promise<void>
    end: () => Promise<void>
}

export const app: Express = express();
export var database: DatabaseInterface
export const init_db = (db: DatabaseInterface) => {
    database = db
}

const options : object = {
    apis: ['./src/routes/*.ts'],
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Dynafood API',
            version: '1.0.0',
            description: 'Api to get Food-information'
        },
        servers: [
            {
                url: 'http://localhost:8081'
            }
        ]
    }
};

const specs: object = swaggerJSDoc(options);

app.use(cors());
app.use(express.json({ limit: '200kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs));

app.use(mainRouter);
app.use(userRouter);
app.use(settingRouter);
app.use(historyRouter);
app.use(productRouter);
app.use(resetPasswordRouter);
app.use(logger);


