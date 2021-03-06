import http from 'http';
import jwt from 'jsonwebtoken';
import { UserInterface } from './include/userInterface';
import { app, database, init_db, init_jwt, init_mail, JWT } from './server_config'
import Database from './src/modules/db';
import mail_1 from '@sendgrid/mail';

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
database.connect()
server.listen(PORT, () =>
    console.log(`[LOGGER] The server is listening on port ${PORT}`)
);