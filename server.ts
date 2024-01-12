import http from "http"
import jwt from 'jsonwebtoken';
import { UserInterface } from './include/userInterface';
import { app, database, init_db, init_jwt, init_mail, JWT } from './server_config'
import Database, { db_adm_conn } from './src/modules/db';
import mail_1 from '@sendgrid/mail';
import schedule from 'node-schedule'
import * as dotenv from 'dotenv';
dotenv.config();

const PORT: string | undefined = process.env.PORT;

const server: http.Server = new http.Server(app);

const jwt_obj: JWT = {
    create: (userid: string) : string => {
        return <string>jwt.sign({ userid: userid }, <string>process.env.JWT_SECRET, { expiresIn: '1h' });
    },
    validate: (token: string) : UserInterface => {
        return <UserInterface>(jwt.verify(token, <string>process.env.JWT_SECRET));
    }
}
mail_1.setApiKey(process.env.SENDGRID_KEY!);

init_jwt(jwt_obj)
init_db(Database)
init_mail(mail_1)
import mail from "./__tests__/jest/unit/mocks/mock_mail"
mail.init()
database.connect()
server.listen(PORT, () =>
    console.log(`[LOGGER] The server is listening on port ${PORT}`)
);

schedule.scheduleJob('0 0 * * *', async () => {
    await db_adm_conn.query(`
        DELETE FROM TrendingProduct
        WHERE dtime < now()-'7 day'::interval;
    `);
})

const reconnect = async () => {
    try {
        await database.end()
        await database.connect()
        console.log("reconnect")
    } catch (err) {
        console.log(err);
        await reconnect();
    }
}

// schedule.scheduleJob('*/2 * * * *', async () => {
//     await reconnect();
// })
