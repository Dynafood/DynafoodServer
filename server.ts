import express, { Express } from 'express';
import http from 'http';
import logger from './src/middleware/logger';
import swaggerUI from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

import mainRouter from './src/routes/index';
import historyRouter from './src/routes/historyRoutes';
import productRouter from './src/routes/productRoutes';
import settingRouter from './src/routes/settingsRoutes';
import userRouter from './src/routes/userRoutes';
import resetPasswordRouter from './src/routes/resetPassword';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const PORT: string | undefined = process.env.PORT;
const app: Express = express();
const server: http.Server = new http.Server(app);

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

server.listen(PORT, () =>
    console.log(`[LOGGER] The server is listening on port ${PORT}`)
);
