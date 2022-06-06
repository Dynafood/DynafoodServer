import http from 'http';
import { app, database, init_db } from './server_config'
import Database from './src/modules/db';

const PORT: string | undefined = process.env.PORT;

const server: http.Server = new http.Server(app);

init_db(Database)
database.connect()
server.listen(PORT, () =>
    console.log(`[LOGGER] The server is listening on port ${PORT}`)
);