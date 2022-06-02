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
import feedbackRouter from './src/routes/feedbackRoutes'

import cookieParser from 'cookie-parser';
import cors from 'cors';
import { QueryResultRow } from 'pg';
import { UserInterface } from './include/userInterface';

export interface DatabaseInterface {
    Feedback: {
        createNewFeedback: (reason: string, content: string, userid: string) => Promise<void>
    }
    History: {
        deleteElementFromHistory: (elementid: string, userid: string) => Promise<void>
        getElements: (userid: string) => Promise<Array<QueryResultRow>>
        updateHistory: (userID: string, barcode: string, product: JsonObject) => Promise<void>
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
export const init_db = (db: JsonObject) => {
    database = db
}
export var database: JsonObject

export interface JWT {
    create: (userid: string) => string
    validate: (token: string) => UserInterface
}
export const init_jwt = (jwt_obj: JWT) => {
    JWT = jwt_obj
}
export var JWT: JWT;

export const app: Express = express();



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
app.use(feedbackRouter)
app.use(logger);


