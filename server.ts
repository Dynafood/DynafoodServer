import http from 'http';
import jwt from 'jsonwebtoken';
import { UserInterface } from './include/userInterface';
import { app, database, init_db, init_jwt, JWT } from './server_config'
import Database from './src/modules/db';

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

init_jwt(jwt_obj)
init_db(Database)
database.connect()
server.listen(PORT, () =>
    console.log(`[LOGGER] The server is listening on port ${PORT}`)
);