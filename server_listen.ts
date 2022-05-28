import {app} from "./server"
import http from 'http'
import path from 'path'
const PORT: string | undefined = process.env.PORT


const server: http.Server = new http.Server(app);

server.listen(PORT, () =>

console.log(`[LOGGER] The server is listening on port ${PORT}`))