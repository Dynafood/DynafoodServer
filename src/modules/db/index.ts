import pg from 'pg'
import { Request, Response } from 'express';
import { PG_USER, PG_PASSWORD, PG_HOST, PG_PORT, PG_DATABASE } from '../../config/index';
import * as dotenv from 'dotenv'
dotenv.config()
const Client = pg.Client;
const Pool = pg.Pool;

console.log('this is db_vars:', 
process.env.DB_USER, process.env.DB_PORT, process.env.DB_HOST, process.env.DB_DATABASE);

//const connectionString =  'postgres://' + process.env.DB_USER + ':' + process.env.DB_PASSWORD + DB_STRING

const connectionString = `postgresql://${process.env.PG_USER}:${process.env.PG_PASSWORD}@${process.env.PG_HOST}:${process.env.PG_PORT}/${process.env.PG_DATABASE}`;
//const connectionString =  process.env.NODE_ENV === 'production' ? process.env.DATABASE_URL : `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}${DB_STRING}`

export let db_adm_conn: pg.Client;
if (process.env.NODE_ENV !== 'production') {
    db_adm_conn = new Client({
        connectionString,
      });    

} else {
    db_adm_conn = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });
}
  
db_adm_conn.connect();

  
export const showTables = (req: Request, res: Response) => { 
    db_adm_conn.query('SELECT table_schema,table_name FROM information_schema.tables;', (err, res) => {
        if (err) throw err;
        for (let row of res.rows) {
            console.log(JSON.stringify(row));
        }
    });
    res.status(200).json({"msg" : "showtables function"})
}  

export const whatTimePGQL = (req: Request, res: Response) => {

    db_adm_conn.query('SELECT NOW()', (err, result) => {
        if (err) {
            res.status(500).json(err.stack)
            return console.error('Error executing query', err.stack)
        }
        console.log(result.rows)
        res.status(200).send(result.rows)
    })
}

export const getEcho = async (req: Request, res: Response) => {
     res.send(JSON.stringify(req.query));
 };

export const getUsers = async (req: Request, res: Response) => {
   console.log('[LOGGER], getUsers func')
     res.send(await db_adm_conn.query(`SELECT * FROM EndUser`));
};

export default db_adm_conn

// export const poolExample = () => {

//     console.log('[EXAMPLE] I am DB Pool example func')

//     const pool = new Pool({
//         connectionString: connectionString,
//         max: 20,
//         idleTimeoutMillis: 30000,
//         connectionTimeoutMillis: 2000,
//     })
    
    
//     pool.connect((err, client, release) => {
//         if (err) {
//             return console.error('Error acquiring client', err.stack)
//         }
//         client.query('SELECT NOW()', (err, result) => {
//             release()
//             if (err) {
//             return console.error('Error executing query', err.stack)
//             }
//         console.log(result.rows)
//         })
//     })    

// }

// export function connect() {
//     let db_adm_conn = new Client({
//         connectionString : connectionString
//     });
//     db_adm_conn.on('error', error => {
//         connect();
//     });
//     db_adm_conn.connect().catch(() => { connect() });
//     return db_adm_conn
// }
// export let db_adm_conn = connect()
