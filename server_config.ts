import session from "cookie-session";
import passport from "passport";
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
import searchRouter from './src/routes/searchRoutes'
import trendingRouter from './src/routes/trendingProducts'
import shoppingListRouter from './src/routes/shoppingListRoutes';
import oauthRouter from './src/routes/oauthRoutes';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { QueryResultRow } from 'pg';
import { UserInterface } from './include/userInterface';
import bodyParser from "body-parser";

export interface DatabaseInterface {
    Query: {
        query: (query: string) => Promise<any>
    }
    ShoppingList: {
        createShoppingList: (name: string, userid: string) => Promise<void>
        updateShoppingList: (name: string, listID: string, userid: string) => Promise<void>
        createShoppingListItem: (itemName: string, listID: string, barcode: string | null, quantity: number | null) => Promise<void>
        deleteShoppingList: (listid: string, userid: string) => Promise<void>
        deleteShoppingListItem: (itemid: string, userid: string) => Promise<void>
        updateShoppingListItem: (itemName: string | null, barcode: string | null, quantity: number | null, check: boolean | null, itemid: string) => Promise<void>
        getShoppingListItems: (listid: string, userid: string) => Promise<Array<QueryResultRow>>
        getShoppingLists: (userid: string) => Promise<Array<QueryResultRow>>
    }
    Feedback: {
        createNewFeedback: (reason: string, content: string, userid: string) => Promise<void>
    }
    History: {
        deleteElementFromHistory: (elementid: string, userid: string) => Promise<void>
        getElements: (userid: string) => Promise<Array<QueryResultRow>>
        updateHistory: (userID: string, barcode: string, product: JsonObject) => Promise<void>
    }
    Password: {
        updatePassword: (email: string, newPassword: string, code: string) => Promise<string>
    }
    User: {
        createUser: (firstName: string, lastName: string, userName: string, email: string, phoneNumber: string, password: string, email_confimed: boolean, cc: string) => Promise<QueryResultRow>
        createUserOAuth: (userid: string, provider_id: string, userName: string, pictureLink: string, email: string, userProviderId: string) => Promise<QueryResultRow>
        getUser: (userid: string | null, email: string | null) => Promise<Array<QueryResultRow>>
        deleteUser: (userid: string) => Promise<QueryResultRow>
        getPasswordResetToken: (userid: string) => Promise<QueryResultRow | undefined>
        setPasswordResetToken: (userid: string, token: string) => Promise<QueryResultRow>
        setEmailConfirmed: (email: string) => Promise<QueryResultRow>
        getEmailConfirmed: (email: string) => Promise<QueryResultRow>
    }
    Settings: {
        getRestrictionIdByName: (restrictionName: string) => Promise<string | null>
        userHasRestriction: (userid: string, restrictionid: string) => Promise<boolean>
        getAlertSettings: (userid: string) => Promise<Array<QueryResultRow>>
        updateAlertSetting: (userid: string, alertActivation: string, restrictionID: string, strongness: number) => Promise<void>
        deleteAlertSetting: (userid: string, restrictionID: string) => Promise<void>
        createSetting: (alertactivation: string, userid: string, restrictionid: string, strongness: number) => Promise<void>
    },
    ResetPassword: {
        updatePassword: (email: string, newPassword: string, code: string) => Promise<string>
    },
    TrendingProducts: {
        getTrendingGlobal: (count: number) => Promise<Array<QueryResultRow>>
        getTrendingLocal: (count: number, country_code: string) => Promise<Array<QueryResultRow>>
        insert: (userID: string, barcode: string, productName: string, imageLink: string) => Promise<void>
        getCountryCode: (userID: string) => Promise<string>
    },
    OAuth: {
        getProviderByName: (name: string) => Promise<QueryResultRow>
    },
    Search: {
        getAllergenbyName: (name: string, language: string) => Promise<Array<string>>
    },
    Product: {
        getProductByBarcode: (barcode: string) => Promise<QueryResultRow>,
        getAllergensByBarcode: (barcode: string, order_lang: string) => Promise<Array<string>>
        getCategoriesByBarcode: (barcode: string) => Promise<Array<string>>
        getIngredientsByBarcode: (barcode: string, order_lang: string) => Promise<Array<JsonObject>>
        getProductsByName: (name: string) => Promise<Array<JsonObject>>

    }
    connect: () => Promise<void>
    end: () => Promise<void>
}
export const init_db = (db: DatabaseInterface) => {
    database = db
}
export let database: DatabaseInterface

export interface JWT {
    create: (userid: string) => string
    validate: (token: string) => UserInterface
}
export const init_jwt = (jwt_obj: JWT) => {
    JWT = jwt_obj
}
export let JWT: JWT;


export interface EmailSender {
    send: (email: JsonObject) => Promise<void>
}
export const init_mail = (mail: JsonObject) => {
    mail_sender = mail
}
export let mail_sender: JsonObject

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

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());
app.use(express.json({ limit: '200kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs));
app.use(logger.logger);
app.use(logger.outgoingLogger);

app.use(mainRouter);
app.use(userRouter);
app.use(settingRouter);
app.use(historyRouter);
app.use(productRouter);
app.use(resetPasswordRouter);
app.use(feedbackRouter)
app.use(searchRouter)
app.use(trendingRouter)
app.use(shoppingListRouter)
app.use(
    session({
      overwrite: false,
      secret: process.env.JWT_SECRET || "kdjfiej2839jf",
    })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(oauthRouter);